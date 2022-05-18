const childProcess = require("child_process");
const path = require("path");

const prerenderScript = path.resolve(__dirname, "prerender-process.js");
const prerenderProcess = childProcess.fork(prerenderScript, [], {
  cwd: path.resolve(__dirname, "../"),
  stdio: "pipe"
});

prerenderProcess.stdout.on("data", (data) => console.log(data.toString().replace(/(^\s+|\s+$)/g, '')));

prerenderProcess.stderr.on("data", (data) => console.log(data.toString().replace(/(^\s+|\s+$)/g, '')));
