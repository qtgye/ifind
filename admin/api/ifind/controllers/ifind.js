const Readable = require("stream").Readable;
const Prerenderer = require("../../../prerenderer");

module.exports = {
  async prerender(context) {
    const { command } = context.params;
    const stream = new Readable({ read() {} });
    const responseData = {
      success: false,
      error: "",
    };

    context.status = 200;
    context.body = stream;

    // Disable prerendering service in development
    // if (/dev|local/.test(env.ENV)) {
    //   console.info(
    //     "Prerendering endpoint is disabled in development enviroment."
    //   );
    //   return true;
    // }

    await new Promise(async (resolve) => {
      // let tries = 5;
      // const interval = setInterval(() => {
      //   stream.push(Date.now() + "");

      //   console.log("message added");

      //   if (-!--tries) {
      //     clearInterval(interval);
      //     resolve(null);
      //   }
      // }, 1000);

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

          prerenderer.on("exit", (exitCode) => {
            console.log("prerenderer exits", exitCode);
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

    console.log("prerender promise resolved");
    console.log(responseData);

    stream.push(JSON.stringify(responseData));
    stream.push(null);
  },
};
