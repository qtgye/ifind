require("colors");
const fs = require("fs-extra");
const path = require("path");
const glob = require("glob");

const MARKDOWN_TABLE_COLUMNS = 5;

const resolveApp = (relativePath) =>
  path.resolve(__dirname, "../", relativePath);

const readMeTemplate = fs
  .readFileSync(resolveApp("src/README.template.md"))
  .toString();

// Ensure output dirs are present
fs.mkdirpSync(resolveApp("dist"), { recursive: true });
fs.outputFileSync(resolveApp("dist/ifind-icons-sprite.svg"), "");

const iconFiles = glob.sync(resolveApp("src/icons/**/*.svg"));
const iconsList = [];

// Add SVG source files — the manual way ...
iconFiles.forEach((iconFile) => {
  iconsList.push(
    iconFile
      .split(/[\\\/]/g)
      .pop()
      .replace(/\..+$/, "")
  );
});

const iconsListString = iconsList.map((iconName) => `'${iconName}'`).join(",");
const iconsTableMd = Array.from({ length: MARKDOWN_TABLE_COLUMNS })
  .fill("")
  .concat(Array.from({ length: MARKDOWN_TABLE_COLUMNS }).fill("---"))
  .concat(iconsList)
  .reduce((chunks, icon, index) => {
    const group = Math.floor(index / 5);
    chunks[group] = chunks[group] || [];
    chunks[group].push(icon || "");
    return chunks;
  }, [])
  .map((row) => `| ${row.join(" | ")} |`)
  .join("  \n");

const iconsListContent = `module.exports = [ ${iconsListString} ];`;

Promise.all([
  (() => fs.outputFileSync(resolveApp("icons-list.js"), iconsListContent))(),
  (() =>
    fs.outputFileSync(
      resolveApp("README.md"),
      readMeTemplate.replace("{iconsTable}", iconsTableMd)
    ))(),
]).then(() => {
  console.log("Generated icons:".green.bold);
  console.log(iconsList.slice(1).join(", ").green);
});
