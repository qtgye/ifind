module.exports = {
  apps: [
    {
      name: "admin",
      script: "npm",
      args: "run develop",
      watch: false,
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
