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

  /**@return {Promise<Prerenderer>} */
  async start() {
    this.stop();

    this.prerenderProcess = childProcess.fork(prerenderScript, [], {
      cwd: path.resolve(WEB_ROOT),
      stdio: "pipe",
    });

    this.prerenderProcess.stdout.on("data", (data) => {
      const message = data.toString().replace(/(^\s+|\s+$)/g, "");
      // LOGGER.log(message, "INFO");
      // console.log(message);
      this.#eventEmitter.emit("log", message);
    });

    this.prerenderProcess.stderr.on("data", (data) => {
      const message = data.toString().replace(/(^\s+|\s+$)/g, "");
      // LOGGER.log(message, "ERROR");
      // console.log(message);
      this.#eventEmitter.emit("error", message);
    });

    this.prerenderProcess.on("exit", () => {
      this.#eventEmitter.emit("exit");
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
    this.prerenderProcess?.kill("SIGINT");
  }

  async getLogs() {
    return await LOGGER.getAll();
  }
}

module.exports = Prerenderer;
