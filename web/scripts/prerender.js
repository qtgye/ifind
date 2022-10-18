const path = require("path");
const fs = require("fs-extra");
const { default: nextBuild } = require("next/dist/build");
const { default: nextExport } = require("next/dist/export");
const { trace } = require("next/dist/trace");
const { STATIC_WEB_ROOT } = require("dotenv").config().parsed;

const PROJECT_ROOT = path.resolve(__dirname, "../");
const OUT_DIR = path.resolve(PROJECT_ROOT, "out");

// Source: next/dist/cli/next-export
const span = trace("next-export-cli");

try {
  (async () => {
    // Ensure empty out dir
    console.info('Cleaning up output directories.');
    fs.rmdirSync(OUT_DIR, { recursive: true, force: true });

    // Run next build
    console.info('Running NextJS build');
    await nextBuild(PROJECT_ROOT, null, false, true, true);

    // Run next export
    console.info('Running NextJS export');
    await nextExport(
      PROJECT_ROOT,
      {
        outdir: OUT_DIR,
      },
      span
    );

    // Move static site files
    console.log("Static files generated. Moving to web root...");

    if (OUT_DIR !== STATIC_WEB_ROOT) {
      fs.moveSync(OUT_DIR, STATIC_WEB_ROOT, { overwrite: true });
    }
    console.info(`Successfuly exported files to ${STATIC_WEB_ROOT}`);

    process.exit();
  })();
} catch (err) {
  console.error(err);
}
