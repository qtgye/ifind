declare interface CategoriesContextData {
  categoryTree?: (CategoryWithChild|null)[]
  subCategories?: (CategoryWithChild|null)[]
  setSubCategories?: (subcategories: (CategoryWithChild|null)[]) => any
}
