const ScheduledTasks = appRequire('scheduled-tasks');

module.exports = strapi => {
  return {
    async initialize() {
      // Custom strapi script doesn't start the admin server
      if ( strapi.config.serveAdminPanel ) {
        strapi.scheduledTasks = new ScheduledTasks();
        strapi.scheduledTasks.init();
      }
    },
  };
};
