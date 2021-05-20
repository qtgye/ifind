const { sanitizeEntity } = require('strapi-utils');

module.exports = {
  definition: `
    type PageData {
      slug: String!
      data: ComponentEntryFieldsPageFields
    }
  `,
  query: `
    pageBySlug(slug: String!, language: String): PageData
  `,
  resolver: {
    Query: {
      async pageBySlug(_, args) {
        console.log({ args });
        // const pageData = await strapi.services['pages'].findByLanguage(args.language);
        // return footerSettings;
      }
    }
  }
};
