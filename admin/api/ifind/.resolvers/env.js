module.exports = {
  query: `
    env: EnvType
  `,
  resolveQuery: {
    async env() {
      return process.env;
    },
  },
};
