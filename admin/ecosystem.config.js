module.exports = {
  apps: [
    {
      name: "admin",
      script: "npm",
      args: "run develop",
      watch: false,
      max_memory_restart: "200M",
    },
    {
      name: "amazon-page-errors",
      script: "npm",
      args: "run serve:amazon-page-errors",
      watch: false,
    },
  ],
};
