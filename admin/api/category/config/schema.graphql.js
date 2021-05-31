module.exports = {
  definition: `
    type CategoryWithChild {
      label: String!
      id: String!
      order: Int!
      icon: String
      children: [ Category ]
    }

    type CategoryTree {
      language: Language
      categories: [ CategoryWithChild ]
    }
  `,
  query: `
    categoryTree (language: String!): CategoryTree
  `,
  resolver: {
    Query: {
      async categoryTree(_, args, ...rest) {
        const categoryTree = await strapi.services.category.categoryTree(args.language);
        return categoryTree;
      }
    }
  }
};
