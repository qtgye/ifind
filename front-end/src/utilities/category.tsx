export const getGrandchildrenCategories = (
  categories: (CategoryWithChild | null)[]
) => {
  const grandChildrenCategories: (CategoryWithChild | null)[] = [];

  categories.forEach((category: CategoryWithChild | null) => {
    if (category?.children) {
      grandChildrenCategories.push(
        ...getGrandchildrenCategories(category.children)
      );
    } else {
      grandChildrenCategories.push(category);
    }
  });

  return grandChildrenCategories;
};
