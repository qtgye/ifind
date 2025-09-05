module.exports = {
  apps: [
    {
      name: "ifind_admin",
      script: "npm",
      args: "run develop",
      watch: false,
      max_memory_restart: "200M",
      cwd: "/admin",
      env: {
        ...process.env,
        NODE_TLS_REJECT_UNAUTHORIZED: "0",
      },
    },
  ],
};
