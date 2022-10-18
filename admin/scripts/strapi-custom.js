require("colors");
const fs = require("fs-extra");
const path = require("path");
const chokidar = require("chokidar");
const { debounce } = require("underscore");
const childProcess = require("child_process");
const { iconsList } = require("ifind-icons");
const processArgs = process.argv.slice(2);
const args = require("minimist")(processArgs);
const strapiNativeCommands = ["start", "build", "develop"];
const strapiBin = "strapi/bin/strapi";

const adminRoot = path.resolve(__dirname, "../");
require(path.resolve(adminRoot, "helpers/customGlobals"));

const strapi = require("strapi");

// FLAGS
let watchingFiles = false;
let restartingStrapi = false;
let strapiForkedProcess;

// Disable certificate check due to Node's behavior
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

const cleanOutputFolders = () => {
  const build = resolveApp("build");
  const cache = resolveApp(".cache");
  const rmOptions = { recursive: true, force: true };

  console.info("Removing build and cache folders...");
  fs.rmdirSync(build, rmOptions);
  fs.rmdirSync(cache, rmOptions);
};

const loadIcons = () => {
  require(path.resolve(__dirname, "load-icons"));
};

/**
 * Ensure Category API's icon field is populated with the IFIND icons package
 */
const loadCategoryIcons = () => {
  const categoryModelSettingsFile = resolveApp(
    "api/category/models/category.settings.json"
  );
  const categoryModelSettings = JSON.parse(
    fs.readFileSync(categoryModelSettingsFile).toString()
  );
  // Supply icon names as enum options,
  // But change dashes into underscores so enumParser won't throw error
  // just handle changing back to dash in the front-end
  categoryModelSettings.attributes.icon.enum = iconsList.map((icon) =>
    icon.replace(/-/g, "_")
  );
  // Write updated category model settings
  fs.writeFileSync(
    categoryModelSettingsFile,
    JSON.stringify(categoryModelSettings, null, "  ")
  );
};

/**
 * Creates a strapi instance using our configs, without serving admin panel
 * @returns {Promise} - Passes loaded strapi instance
 */
const createStrapiInstance = (serveAdminPanel = false) =>
  strapi({
    dir: adminRoot,
    serveAdminPanel: false,
  }).load();

/**
 * Creates a strapi process call using child process,
 * so we can manually restart it at will.
 * @returns {ChildProcess}
 */
const strapiProcess = async () => {
  const strapiPath = require.resolve(strapiBin);

  await new Promise(resolve => setTimeout(resolve, 1000));

  const strapiChildProcess = childProcess.fork(strapiPath, processArgs, {
    stdio: "pipe",
    env: process.env,
    cwd: process.cwd(),
  });

  // Save child process instance
  strapiForkedProcess = strapiChildProcess;

  // Add running flag
  strapiChildProcess.running = true;

  strapiChildProcess.stderr.on("data", (data) => {
    console.error(data.toString());
  });

  strapiChildProcess.once("exit", () => {
    delete strapiChildProcess.running;

    if (restartingStrapi) {
      restartingStrapi = false;

      // Ensure process is killed
      console.info("Force-killing process");
      strapiChildProcess.kill("SIGKILL");

      preBuild();

      // Spawn a new process
      strapiProcess();
    }
  });

  strapiChildProcess.stdout.on("data", (data) => {
    const dataString = data.toString();

    switch (true) {
      case (/strapi-after-init/.test(dataString) && !watchingFiles):
        watchingFiles = true;

        // START WATCHER
        const watcher = chokidar.watch([
          path.resolve(
            process.cwd(),
            "{admin,api,components,config,extensions,helpers,hooks,prerenderer,scheduled-tasks}/**/*.{js,jsx,ts,tsx}"
          ),
          path.resolve(
            process.cwd(),
            "plugins/{icons,ifind,strapi-icons}/**/*.{js,jsx,ts,tsx}"
          ),
          path.resolve(process.cwd(), "index.js"),
        ]);

        watcher.on(
          "all",
          debounce((event, path) => {
            if (/change|unlink/.test(event)) {
              console.info(`Change detected on file: ${path}`.cyan);
              console.info(`Restarting Strapi process...`.cyan);
              restartingStrapi = true;

              // Kill current process if any,
              // or spawn a new one
              if ( strapiForkedProcess?.running ) {
                strapiForkedProcess.kill("SIGINT");
              } else {
                strapiProcess();
              }
            }
          }, 1000)
        );

        console.info("Watching files for changes...".green);
        break;

      default:
        process.stdout.write(dataString);
    }
  });

  return strapiChildProcess;
};

const watchStrapiProcess = () => {
  if (process.strapiBinRequested || watchingFiles) {
    return;
  }

  process.strapiBinRequested = true;
  strapiProcess();
};

const preBuild = () => {
  // Clean up
  cleanOutputFolders();

  // Load icons
  loadIcons();
  loadCategoryIcons();
}

if (args._.some((command) => strapiNativeCommands.includes(command))) {
  const command = args._.find((command) => strapiNativeCommands.includes(command));

  if ( /develop/.test(command) ) {
    preBuild();
  }

  if (/dev|local/.test(process.env.ENV)) {
    watchStrapiProcess();
  } else {
    require(strapiBin);
  }
} else {
  module.exports = createStrapiInstance;
}
