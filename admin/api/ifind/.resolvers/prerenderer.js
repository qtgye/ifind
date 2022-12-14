const Prerenderer = require("../../../prerenderer");

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
    async prerenderer(_, { command }, { context }) {
      const { res: response } = context;

      // Disable prerendering service in development
      // if (/dev|local/.test(env.ENV)) {
      //   console.info(
      //     "Prerendering endpoint is disabled in development enviroment."
      //   );
      //   return true;
      // }

      response.on("end", () => {
        console.log("response ends");
      });

      switch (command) {
        case "start":
          /**@type {Prerenderer} */
          const prerenderer = await strapi.prerenderer.start();

          await new Promise((resolve) => {
            prerenderer.on("log", (message) => {
              console.log({ message });
              response.write(
                JSON.stringify({
                  message,
                  type: "info",
                })
              );
            });

            prerenderer.on("error", (message) => {
              console.log({ error: message });
              response.write(
                JSON.stringify({
                  message,
                  type: "error",
                })
              );
            });

            prerenderer.on("exit", resolve);
          });

          response.status(200);
          response.send({ success: true });
          response.end();
          return response;
        case "stop":
          await strapi.prerenderer.stop();
          return true;
      }
    },
  },
};
