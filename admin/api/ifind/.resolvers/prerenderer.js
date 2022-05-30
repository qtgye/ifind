module.exports = {
  query: `
    prerendererLogs: [PrerendererLogEntry]
  `,
  mutation: `
    prerenderer( command: PRERENDERER_COMMAND! ): Boolean
  `,
  resolveQuery: {
    async prerendererLogs() {
      return await strapi.prerenderer.getLogs();
    },
  },
  resolveMutation: {
    async prerenderer(_, { command }) {
      switch (command) {
        case "start":
          await strapi.prerenderer.start();
          break;
        case "stop":
          await strapi.prerenderer.stop();
          break;
      }
      return true;
    },
  },
};
