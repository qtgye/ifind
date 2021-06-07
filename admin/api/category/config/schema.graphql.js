module.exports = {
  definition: `
    type CategoryWithChild {
      label: ComponentAtomsTranslateableLabel
      id: ID!
      order: Int!
      icon: String
      region: Region
      children: [ CategoryWithChild ]
    }
  `,
  query: `
    categoryTree (region: String!, language: String): [CategoryWithChild]
  `,
  resolver: {
    Query: {
      async categoryTree(_, args, ...rest) {
        const categoryTree = await strapi.services.category.categoryTree(args.region, args.language);
        return categoryTree;
      }
    }
  }
};
