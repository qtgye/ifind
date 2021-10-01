const { existsSync } = require("fs-extra");
const path = require("path");

const backgroundProcessesRoot = path.resolve(
  __dirname,
  "../../../background-process"
);
module.exports = (backgroundProcessName) => {
  const backgroundProcessFolder = path.resolve(
    backgroundProcessesRoot,
    backgroundProcessName.replace("_", "-")
  );

  if (!existsSync(backgroundProcessFolder)) {
    return null;
  }

  return backgroundProcessFolder;
}
