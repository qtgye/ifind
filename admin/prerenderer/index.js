const childProcess = require("child_process");
const path = require("path");
const Logger = require("./Logger");

const LOGGER = new Logger({
  baseDir: path.resolve(__dirname),
});
const WEB_ROOT = path.resolve(__dirname, "../../web");
const prerenderScript = path.resolve(WEB_ROOT, "scripts/prerender.js");

class Prerenderer {
  prerenderProcess = null;

  init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    LOGGER.log("Prerenderer initialized".magenta.bold);
  }

  async start() {
    this.stop();

    this.prerenderProcess = childProcess.fork(prerenderScript, [], {
      cwd: path.resolve(WEB_ROOT),
      stdio: "pipe",
    });

    this.prerenderProcess.stdout.on("data", (data) => {
      const message = data.toString().replace(/(^\s+|\s+$)/g, "");
      LOGGER.log(message, "INFO");
      console.log(message);
    });

    this.prerenderProcess.stderr.on("data", (data) => {
      const message = data.toString().replace(/(^\s+|\s+$)/g, "");
      LOGGER.log(message, "ERROR");
      console.log(message);
    });
  }

  stop() {
    this.prerenderProcess?.kill("SIGINT");
  }

  async getLogs() {
    return await LOGGER.getAll();
  }
}

module.exports = Prerenderer;
