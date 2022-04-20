declare interface CategoriesContextData {
  loading?: boolean;
  categoryTree?: (CategoryWithChild|null)[]
  subCategories?: (CategoryWithChild|null)[]
  setSubCategories?: (subcategories: (CategoryWithChild|null)[]) => any
}
