const { readFileSync, existsSync } = require("fs-extra");
const glob = require("glob");
const path = require("path");

const backgroundProcessesRoot = path.resolve(
  __dirname,
  "../../../background-process"
);

module.exports = {
  async getBackgroundProcess(backgroundProcessName) {
    const backgroundProcessFolder = path.resolve(
      backgroundProcessesRoot,
      backgroundProcessName.replace("_", "-")
    );

    if (!existsSync(backgroundProcessFolder)) {
      return null;
    }

    // Get current status through the switch file
    const [switchFilePath] = glob.sync(
      path.resolve(backgroundProcessFolder, ".switch")
    );
    const status = switchFilePath
      ? readFileSync(switchFilePath).toString().trim()
      : "stopped";

    const logFilesPaths = glob.sync(
      path.resolve(backgroundProcessFolder, "logs/*.log")
    );
    const logs = [];
    logFilesPaths.forEach((logFilePath) => {
      const logFileContents = readFileSync(logFilePath).toString();
      const logEntries = logFileContents.split("\n");
      logEntries.forEach((logEntry) => {
        const [date_time = "", type = "", message = ""] = logEntry.split(" | ");

        // Remove ANSI formatting on some properties
        logs.push({
          date_time: date_time.replace(/\u001b\[\d+m/gi, "").trim(),
          type: type.replace(/\u001b\[\d+m/gi, "").trim() || 'INFO',
          message,
        });
      });
    });

    return {
      status,
      logs,
    };
  },
};
