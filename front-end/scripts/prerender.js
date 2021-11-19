require("colors");
const {
  outputFileSync,
  ensureDirSync,
  copySync,
  rmdirSync,
} = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer");
const express = require("express");
const fetch = require("node-fetch");
const { REACT_APP_ADMIN_API_ROOT } = require("dotenv").config().parsed;

const routes = ["/productcomparison", "/contact"];

const PORT = 0;
const APP_ROOT = path.resolve(__dirname, "../");
const BUILD_ROOT = path.resolve(APP_ROOT, "build");
const STATIC_ROOT = path.resolve(APP_ROOT, "static");

const app = express();
app.use(express.static("build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(BUILD_ROOT, "index.html"));
});

const prerender = async (usedPort) => {
  // https://stackoverflow.com/a/48960988
  process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

  // Get dynamic routes from API
  try {
    console.log("Getting page routes from API...".cyan);

    const response = await fetch(REACT_APP_ADMIN_API_ROOT.replace('localhost', '127.0.0.1'), {
      method: "post",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        query: `
          query {
            pages {
              slug
            }
          }
        `,
      }),
    });
    const { data } = await response.json();

    if (data.pages && data.pages.length) {
      data.pages.forEach(({ slug }) => routes.push(`/${slug}`));
    }
  } catch (err) {
    console.log(err.message.red);
  }

  console.log(`Prerendering ${routes.length} route(s)...`.cyan);

  // Remove old static files
  rmdirSync(STATIC_ROOT, { recursive: true });

  // Copy build to static folder
  copySync(BUILD_ROOT, STATIC_ROOT);

  // Always scrape the homepage last, since this will override index.html
  routes.push("/");

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  for (const route of routes) {
    const url = `http://127.0.0.1:${usedPort}${route}`;
    console.log(`Scraping route: ${route.bold} at ${url}`.green);

    await page.goto(url, {
      waitUntil: "networkidle0",
      timeout: 999999,
    });

    /* eslint-disable no-loop-func */
    const html = await page.evaluate(() => {
      const clientState = window.apolloClient.cache.extract();
      const script = document.createElement("SCRIPT");
      script.innerText = `window['__APOLLO_STORE__']=${JSON.stringify(
        clientState
      )}`;
      document.head.appendChild(script);
      return document.documentElement.outerHTML;
    });

    console.log("Writing to file...");
    const routePath = route.replace(/\/$/, "");
    const routeDir = path.resolve(STATIC_ROOT, routePath.replace(/^\//, ""));
    const routeFile = path.resolve(routeDir, "index.html");

    ensureDirSync(routeDir);
    outputFileSync(routeFile, html);
    console.log("DONE");
  }

  // Scrape index
  // {
  //   const url = `http://127.0.0.1:${PORT}/`;
  //   console.log(`Scraping route: ${'/'.bold} at ${url}`.green);

  //   await page.goto(url, {
  //     waitUntil: "networkidle0",
  //     timeout: 999999,
  //   });

  //   /* eslint-disable no-loop-func */
  //   const html = await page.evaluate(() => {
  //     const clientState = window.apolloClient.cache.extract();
  //     const script = document.createElement("SCRIPT");
  //     script.innerText = `window['__APOLLO_STORE__']=${JSON.stringify(
  //       clientState
  //     )}`;
  //     document.head.appendChild(script);
  //     return document.documentElement.outerHTML;
  //   });

  //   console.log("Writing to file...");
  //   const routeDir = path.resolve(STATIC_ROOT);
  //   const routeFile = path.resolve(routeDir, "index-prerendered.html");

  //   ensureDirSync(routeDir);
  //   outputFileSync(routeFile, html);

  //   // Rename original index.html
  //   renameSync(
  //     path.resolve(STATIC_ROOT, "index.html"),
  //     path.resolve(STATIC_ROOT, "index-react.html")
  //   );
  //   console.log("DONE");
  // }

  process.exit();
};

const listener = app.listen(PORT, () => prerender(listener.address().port));
