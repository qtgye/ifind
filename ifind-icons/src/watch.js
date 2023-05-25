const path = require("path");
const chokidar = require("chokidar");
const { debounce } = require("../ifind-utilities/function");
const { build } = require("./index");

const PROJECT_ROOT = path.resolve(__dirname, "../");

const watcher = chokidar.watch(path.resolve(PROJECT_ROOT, "src/icons"), {
  persistent: true,
});

watcher.on(
  "all",
  debounce(async (event, path) => {
    console.info(`Detected ${event} : ${path}, rebuilding...`);
    await build();
  }, 1000)
);

console.info(`Watching files`);
