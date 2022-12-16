/**
 * @typedef {'log'|'error'|'exit'} PrerenderEvents
 */

const childProcess = require("child_process");
const path = require("path");
const EventEmitter = require("events");
const Logger = require("./Logger");

const LOGGER = new Logger({
  baseDir: path.resolve(__dirname),
});
const WEB_ROOT = path.resolve(__dirname, "../../web");
const prerenderScript = path.resolve(WEB_ROOT, "scripts/prerender.js");

class Prerenderer {
  #eventEmitter = new EventEmitter();

  prerenderProcess = null;

  init() {
    if (this.initialized) {
      return;
    }

    this.initialized = true;

    LOGGER.log("Prerenderer initialized".magenta.bold);
  }

  /**@return {Prerenderer} */
  start() {
    this.stop();

    this.prerenderProcess = childProcess.fork(prerenderScript, [], {
      cwd: path.resolve(WEB_ROOT),
      stdio: "pipe",
    });

    this.prerenderProcess.stdout.on("data", (data) => {
      const message = data.toString().replace(/(^\s+|\s+$)/g, "");
      this.#eventEmitter.emit("log", message);
    });

    this.prerenderProcess.stderr.on("data", (data) => {
      const message = data.toString().replace(/(^\s+|\s+$)/g, "");
      this.#eventEmitter.emit("error", message);
    });

    this.prerenderProcess.on("error", (error) => {
      console.log("prerender script error:", error);
      // this.#eventEmitter.emit("error", message);
    });

    this.prerenderProcess.on("exit", (exitCode) => {
      this.#eventEmitter.emit("exit", exitCode);
    });

    return this;
  }

  /**
   * @param {PrerenderEvents} eventName
   * @param {(string) => void} listener
   */
  on(eventName, listener) {
    this.#eventEmitter.on(eventName, listener);
  }

  stop() {
    const oldProcess = this.prerenderProcess;
    oldProcess?.kill("SIGINT");
  }

  async getLogs() {
    return await LOGGER.getAll();
  }
}

module.exports = Prerenderer;
