const ScheduledTasks = appRequire('scheduled-tasks');
const generateAdminTypes = appRequire('scripts/generateAdminTypes');
const clearAmazonScraperErrors = appRequire('helpers/amazon/clearPageErrors');

module.exports = strapi => {
  return {
    async initialize() {
      // Custom strapi script doesn't start the admin server
      if ( strapi.config.serveAdminPanel ) {
        strapi.scheduledTasks = new ScheduledTasks();
        strapi.scheduledTasks.init();

        // Always export admin types when Strapi is loaded,
        // In order for external consuming modules to always have the
        // updated admin types
        setTimeout(generateAdminTypes, 3000);

        // Remove existing scraper error files
        clearAmazonScraperErrors();
      }
    },
  };
};
