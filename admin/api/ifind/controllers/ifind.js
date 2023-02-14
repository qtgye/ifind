const Readable = require("stream").Readable;
const Prerenderer = require("../../../prerenderer");

module.exports = {
  async prerender(context) {
    // Skip prerender on development
    if (/dev/i.test(process.env.ENV)) {
      console.info(`Skipping prerender on local environment.`.cyan);
      context.status = 200;
      return;
    }

    const { command } = context.params;
    const stream = new Readable({ read() {} });
    const responseData = {
      success: false,
      error: "",
    };

    context.status = 200;
    context.body = stream;

    await new Promise(async (resolve) => {
      switch (command) {
        case "start":
          /**@type {Prerenderer} */
          const prerenderer = await strapi.prerenderer.start();

          // Can't stream.push()  log messages since
          // scripts server still waits for the whole prerender process
          // before it receives all the messages.
          prerenderer.on("log", (message) => console.info(message));

          prerenderer.on("error", (message) => {
            console.error(message);
          });

          prerenderer.on("exit", () => {
            responseData.success = true;
            resolve(null);
          });
          break;

        case "stop":
          await strapi.prerenderer.stop();
          responseData.success = true;
          resolve(null);
      }
    });

    stream.push(JSON.stringify(responseData));
    stream.push(null);
  },
};
