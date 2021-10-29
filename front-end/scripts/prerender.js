require("colors");
const { outputFileSync, ensureDirSync, copySync } = require("fs-extra");
const path = require("path");
const puppeteer = require("puppeteer");
const express = require("express");

const routes = ["/productcomparison"];
const PORT = 5678;
const APP_ROOT = path.resolve(__dirname, "../");
const BUILD_ROOT = path.resolve(APP_ROOT, "build");
const STATIC_ROOT = path.resolve(APP_ROOT, "static");

const app = express();
app.use(express.static("build"));
app.get("*", (req, res) => {
  res.sendFile(path.resolve(BUILD_ROOT, "index.html"));
});

const prerender = async () => {
  console.log("Prerendering...");

  // Copy build to static folder
  copySync(BUILD_ROOT, STATIC_ROOT);

  // Always scrape the homepage last, since this will override index.html
  routes.push("/");

  const browser = await puppeteer.launch({
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  const page = await browser.newPage();

  // page.on('console', (message) => console.log(message.text()));

  for (const route of routes) {
    const url = `http://127.0.0.1:${PORT}${route}`;
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

  process.exit();
};

app.listen(PORT, prerender);
