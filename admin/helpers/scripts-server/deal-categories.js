const { get } = require("./request");

module.exports = {
  async all() {
    return await get("/dealCategory");
  },
};
