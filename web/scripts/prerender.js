const childProcess = require("child_process");
const path = require("path");

const prerenderScript = path.resolve(__dirname, "prerender-process.js");
const prerenderProcess = childProcess.fork(prerenderScript, [], {
  cwd: path.resolve(__dirname, "../"),
  stdio: "pipe"
});

prerenderProcess.stdout.on("data", (data) => process.stdout.write(data.toString()));

prerenderProcess.stderr.on("data", (data) => process.stderr.write(data.toString()));
