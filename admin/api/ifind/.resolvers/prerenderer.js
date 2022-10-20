const env = process.env;

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

      // Disable prerendering service in development
      if ( /dev|local/.test(env.ENV) ) {
        console.info('Prerendering endpoint is disabled in development enviroment.');
        return true;
      }

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
