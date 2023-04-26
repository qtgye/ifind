module.exports = {
  apps: [
    {
      name: "ifind_icons",
      script: "npm",
      args: "run watch",
      watch: false,
      max_memory_restart: "200M",
      cwd: "/ifind-icons",
      env: {
        ...process.env,
      },
    },
  ],
};
