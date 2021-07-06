module.exports = {
  definition: `
    type CategoryWithChild {
      label: ComponentAtomsTranslateableLabel
      id: ID!
      order: Int!
      icon: String
      region: Region
      parent: Category
      children: [ CategoryWithChild ]
    }
  `,
  query: `
    categoryTree (language: String): [CategoryWithChild]
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
