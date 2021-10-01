const path = require('path');
const adminRoot = path.resolve(__dirname);

module.exports = {
  apps: [
    {
      name: "admin",
      script: "npm",
      args: "run develop",
      watch: false,
    },
    {
      name: "scheduled-tasks",
      script: "./background-process",
      args: "scheduled-tasks",
      watch: false,
      autorestart: false,
    },
    {
      name: "product-validator",
      script: "./background-process",
      args: "product-validator",
      watch: false,
      autorestart: false,
    },
  ],
};
