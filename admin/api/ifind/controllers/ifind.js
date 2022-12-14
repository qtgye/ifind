const Readable = require("stream").Readable;
const Prerenderer = require("../../../prerenderer");

module.exports = {
  async prerender(context) {
    const { command } = context.params;
    const stream = new Readable({ read() {} });

    context.status = 200;
    context.body = stream;

    // Disable prerendering service in development
    // if (/dev|local/.test(env.ENV)) {
    //   console.info(
    //     "Prerendering endpoint is disabled in development enviroment."
    //   );
    //   return true;
    // }

    let tries = 5;
    const interval = setInterval(() => {
      stream.push(Date.now() + "");

      console.log("message added");

      if (-!--tries) {
        clearInterval(interval);
        stream.push(null);
      }
    }, 1000);

    // process.exit();

    // switch (command) {
    //   case "start":
    //     /**@type {Prerenderer} */
    //     const prerenderer = await strapi.prerenderer.start();

    //     await new Promise((resolve) => {
    //       prerenderer.on("log", (message) => {
    //         console.log({ message });
    //         context.body.push(
    //           JSON.stringify({
    //             message,
    //             type: "info",
    //           })
    //         );
    //       });

    //       prerenderer.on("error", (message) => {
    //         console.log({ error: message });
    //         context.body.push(
    //           JSON.stringify({
    //             message,
    //             type: "error",
    //           })
    //         );
    //       });

    //       prerenderer.on("exit", resolve);
    //     });

    //     context.body.push(null);
    //     return response;
    //   case "stop":
    //     await strapi.prerenderer.stop();
    //     return true;
    // }
  },
};
