const path = require("path");
const fs = require("fs-extra");
const { default: fetch } = require("node-fetch");
const { default: nextBuild } = require("next/dist/build");
const { default: nextExport } = require("next/dist/export");
const { trace } = require("next/dist/trace");
const { STATIC_WEB_ROOT, NEXT_PUBLIC_ADMIN_API_ROOT } =
  require("dotenv").config().parsed;

const PROJECT_ROOT = path.resolve(__dirname, "../");
const OUT_DIR = path.resolve(PROJECT_ROOT, "out");

const ADMIN_HEALTHCHECK_INTERVAL = 10000;
const ADMIN_HEALTHCHECK_MAX_TRIES = 60;

// Source: next/dist/cli/next-export
const span = trace("next-export-cli");

// Disable certificate check
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = "0";

const adminHealthCheck = () =>
  new Promise(async (resolve) => {
    let tries = ADMIN_HEALTHCHECK_MAX_TRIES;

    while (tries) {
      try {
        const response = await fetch(NEXT_PUBLIC_ADMIN_API_ROOT, {
          method: "post",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            query: `
              query {
                products(limit: 1) {
                  id
                }
              }
            `,
          }),
        });

        if (response.status >= 500) {
          throw new Error(`${response.status} ${response.statusText}`);
        }

        if (response.status >= 400) {
          console.info(await response.text());
          throw new Error(`${response.status} ${response.statusText}`);
        }

        const { data } = await response.json();

        if (data && data.products && data.products.length) {
          resolve(true);
          break;
        }
      } catch (err) {
        console.info(` - Server response error: ${err.message}`);
      }

      console.info(
        ` - Rechecking after ${ADMIN_HEALTHCHECK_INTERVAL / 1000} seconds...`
      );
      await new Promise((res) => setTimeout(res, ADMIN_HEALTHCHECK_INTERVAL));

      tries--;
    }

    resolve(false);
  });

try {
  (async () => {
    // Check admin if up
    console.info("Checking admin site...");
    const isAdminUp = await adminHealthCheck();

    if (!isAdminUp) {
      console.error(
        "Admin is still not up for a long time. Skipping prerender."
      );
      process.exit();
    }

    console.info("Admin is up! Proceeding with prerender.");

    // Ensure empty out dir
    console.info("Cleaning up output directories.");
    fs.rmdirSync(OUT_DIR, { recursive: true, force: true });

    // Copy icons
    console.info("Copying icons");
    require("./load-icons");

    // Run next build
    console.info("Running NextJS build");
    await nextBuild(PROJECT_ROOT, null, false, true, true);

    // Run next export
    console.info("Running NextJS export");
    await nextExport(
      PROJECT_ROOT,
      {
        outdir: OUT_DIR,
      },
      span
    );

    // Move static site files
    console.info("Static files generated. Moving to web root...");

    if (OUT_DIR !== STATIC_WEB_ROOT) {
      fs.moveSync(OUT_DIR, STATIC_WEB_ROOT, { overwrite: true });
    }
    console.info(`Successfuly exported files to ${STATIC_WEB_ROOT}`);

    process.exit();
  })();
} catch (err) {
  console.error(err);
}
