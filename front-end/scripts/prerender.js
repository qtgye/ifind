require("colors");
const {
  outputFileSync,
  ensureDirSync,
  copySync,
  rmdirSync,
  moveSync,
  existsSync,
} = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer");
const express = require("express");
const fetch = require("node-fetch");
const {
  REACT_APP_ADMIN_API_ROOT,
  STATIC_WEB_ROOT,
} = require("dotenv").config().parsed;

// Ensure static web root is supplied
if (!STATIC_WEB_ROOT) {
  throw new Error("Please supply STATIC_WEB_ROOT in your .env file.");
}

const routes = ["/", "/productcomparison", "/offers", "/gifts", "/contact"];
const languages = [];
const routesWithLanguages = [];

const PORT = 0;
const APP_ROOT = path.resolve(__dirname, "../");
const BUILD_ROOT = path.resolve(APP_ROOT, "build");
const PRERENDER_TEMP = path.resolve(APP_ROOT, "prerender");

const app = express();
app.use(express.static("build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(BUILD_ROOT, "index.html"));
});

const prerender = async (usedPort) => {
  // https://stackoverflow.com/a/48960988
  process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

  // Get dynamic routes from API
  try {
    console.info("Getting languages and page routes from API...".cyan);

    const [languageCodes, pageSlugs] = await Promise.all([
      // Get Languages
      (async () => {
        const response = await fetch(
          REACT_APP_ADMIN_API_ROOT.replace("localhost", "127.0.0.1"),
          {
            method: "post",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              query: `
                query {
                  languages {
                    code
                  }
                }
              `,
            }),
          }
        );
        const { data } = await response.json();
        const { languages } = data;

        if (languages && languages.length) {
          return languages.map(({ code }) => code);
        }
        return [];
      })(),

      // Get Pages
      (async () => {
        const response = await fetch(
          REACT_APP_ADMIN_API_ROOT.replace("localhost", "127.0.0.1"),
          {
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
          }
        );
        const { data } = await response.json();
        const { pages } = data;
        if (pages && pages.length) {
          return pages.map(({ slug }) => `/${slug}`);
        }
        return [];
      })(),
    ]);

    languages.push(...languageCodes);
    routes.push(...pageSlugs);
  } catch (err) {
    console.error(`Unable to prerender due to error: ${err.message.red}`);
    process.exit();
  }

  // Generate routes with languages
  languages.forEach((language) => {
    routes.forEach((route) => {
      routesWithLanguages.push(`/${language}${route}`);
    });
  });

  // Always scrape the homepage last, since this will override index.html
  routesWithLanguages.push("/");

  // Copy build to prerender folder
  ensureDirSync(PRERENDER_TEMP);
  copySync(BUILD_ROOT, PRERENDER_TEMP);

  console.info(`Prerendering ${routesWithLanguages.length} route(s)...`.cyan);

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  await page.setViewport({
    width: 1920,
    height: 1080,
  });

  let routeIndex = 0;

  for (const route of routesWithLanguages) {
    const url = `http://127.0.0.1:${usedPort}${route}`;
    console.info(
      `[ ${++routeIndex} of ${routesWithLanguages.length} ] Scraping route: ${
        route.bold
      } at ${url}`.green
    );

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

    console.info("Writing to file...");
    const routePath = route.replace(/\/$/, "");
    const routeDir = path.resolve(PRERENDER_TEMP, routePath.replace(/^\//, ""));
    const routeFile = path.resolve(routeDir, "index.html");

    ensureDirSync(routeDir);
    outputFileSync(routeFile, html);
    console.info("DONE");
  }

  console.info(
    `Moving Prerendered files to web root: ${STATIC_WEB_ROOT.bold}`.green
  );

  // Cleanup old static site files
  if (existsSync(STATIC_WEB_ROOT)) {
    rmdirSync(STATIC_WEB_ROOT, { recursive: true, force: true });
  }

  // Move static site files
  moveSync(PRERENDER_TEMP, STATIC_WEB_ROOT);

  process.exit();
};

const listener = app.listen(PORT, () => prerender(listener.address().port));
