require("colors");
const path = require("path");
const glob = require("glob");
const { readFileSync } = require("fs-extra");
const { generateTypeScriptTypes } = require("graphql-schema-typescript");

const projectRoot = path.resolve(__dirname, "../");
const outputPath = path.resolve(projectRoot, "typings/admin.graphql.d.ts");

module.exports = async () => {
  const [schemaFile] = glob.sync(
    path.resolve(projectRoot, "../admin/exports/**/*.graphql")
  );

  if (!schemaFile) {
    console.log(`Unable to find schema file`.yellow);
  }

  const schemaContents = readFileSync(schemaFile).toString();

  const options = {
    global: true,
    typePrefix: "",
  };

  generateTypeScriptTypes(schemaContents, outputPath, options)
    .then(() => {
      console.log("Admin GraphQL Schema has been exported as TS Typed Definitions.".green);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}

