const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  query: `
    pageBySlug(slug: String, language: String): Page
  `,
  resolver: {
    Query: {
      pageBySlug: {
        resolverOf: 'Page.findOne',
        resolver(_, args) {
          // console.log('services', strapi.services);
          // console.log('models', strapi.models);
          // const entity = strapi.services['footer-settings'].findOne(args);
          // return sanitizeEntity(entity, { model: strapi.models.competition });
        }
      }
    }
  }
};
