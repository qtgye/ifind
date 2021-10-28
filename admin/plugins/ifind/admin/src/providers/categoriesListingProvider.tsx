import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  memo,
} from "react";
import { useMutation } from "../helpers/query";
import { useGQLFetch } from "../helpers/gqlFetch";

const CategoriesListingContext = createContext({});

const categoryFieldsOverviewFragment = `
 fragment CategoryFieldsOverview on Category {
   label: label_preview
   id
   order
   icon
 }`;

const categoryFieldsDetailsFragment = `
 fragment CategoryFieldsDetails on Category {
   parent {
     id
     label: label_preview
   }
   products_count
   children_count
 }`;

const categoryFieldsCompleteFragment = `
 ${categoryFieldsOverviewFragment}
 ${categoryFieldsDetailsFragment}
 fragment CategoryFieldsComplete on Category {
   ... CategoryFieldsOverview
   ... CategoryFieldsDetails
 }`;

const categoriesQuery = `
 ${categoryFieldsCompleteFragment}
 query GetCategories {
   categories {
     ... CategoryFieldsComplete
   }
 }
 `;

const categoriesMutation = `
${categoryFieldsCompleteFragment}
mutation UpdateCategories(
  $categories: [updateCategoryInput]
  ) {
    updateCategories( categories: $categories ) {
      ... CategoryFieldsComplete
    }
  }
  `;

export const flattenCategoriesTree = (
  tree: CategoryWithChild[],
  currentDepth = 0
): CategoryWithChild[] => {
  const list = Object.values(tree)
    // Sort items first
    .sort((catA, catB) => (catA.order > catB.order ? 1 : -1))
    // Process each item
    .reduce((_list: CategoryWithChild[], currentNode: CategoryWithChild) => {
      currentNode.depth = currentDepth;

      _list.push(currentNode);

      // Flat-append this item's children
      if (currentNode.children) {
        _list.push(
          ...flattenCategoriesTree(currentNode.children, currentDepth + 1)
        );
        // Remove this item's children prop to avoid confusion
        delete currentNode.children;
      }

      return _list;
    }, []);

  return list;
};

/**
 * Creates an object tree of categories
 * @param {array} rawCategories
 * @returns object
 */
export const mapCategoriesTree = (
  rawCategories: Category[]
): CategoryWithChild[] => {
  let categoryTree = {};
  let byIdIndex = {};

  rawCategories.forEach((category, index) => {
    byIdIndex[category.id] = index;
  });

  if (rawCategories) {
    rawCategories.forEach((category) => {
      // Check if category has existing parent
      if (
        category.parent &&
        category.parent.id in byIdIndex &&
        category.parent.id !== category.id
      ) {
        const parentIndex = byIdIndex[category.parent.id];
        const parentCategory = rawCategories[parentIndex];

        // Append to the parent's children
        parentCategory.children = parentCategory.children || {};
        parentCategory.children[category.id] = category;

        // Determine depth acc. to parent
        let currentDepthCount = 1;
        let currentParent = parentCategory;
        while (
          currentParent?.parent &&
          currentParent.parent.id !== category.id
        ) {
          currentDepthCount++;
          currentParent = rawCategories[byIdIndex[currentParent.parent.id]];
        }
        category.depth = currentDepthCount;
      }
      // Treat this category as a root
      else {
        categoryTree[category.id] = category;
        category.depth = 0;
        // Remove non-existing parent prop to avoid confusion
        delete category.parent;
      }
    });
  }

  return categoryTree;
};

// NOTE: Will deprecate once source region is implemented
export const groupCategoriesByLanguage = (categoriesList, languages) => {
  return languages.map((language) => ({
    language,
    categories: categoriesList.filter(
      (category) => category.language?.id === language.id
    ),
  }));
};

export const groupCategoriesBySourceRegion = (
  categoriesList,
  sourcesRegions
) => {
  return sourcesRegions.map((sourceRegion) => ({
    ...sourceRegion,
    categories: categoriesList.filter(
      (category) =>
        category.source?.id === sourceRegion.source &&
        category.region?.id === sourceRegion.region
    ),
  }));
};

/**
 * Given a category id,
 * this will generate the ancestral path towards the category,
 * with the given category id being the last item in the array
 * Like so: [ grandParent, parent, child, grandChild, ...soOn ]
 */
export const buildCategoryPath = (categoryID, categories = []) => {
  const byId = categories.reduce(
    (all, category) => ({
      ...all,
      [category.id]: category,
    }),
    {}
  );

  const categoryPath = [];
  const matchedCategory = byId[categoryID];

  if (!matchedCategory) {
    return categoryPath;
  }

  let lastCategoryEntry = matchedCategory;
  while (lastCategoryEntry) {
    categoryPath.push(lastCategoryEntry);
    lastCategoryEntry = lastCategoryEntry.parent
      ? byId[lastCategoryEntry.parent.id]
      : null;
  }

  // From granparent -> grandchild
  categoryPath.reverse();

  return categoryPath;
};

export const CategoriesListingProvider = memo(({ children }) => {
  const gqlFetch = useGQLFetch();
  const [categories, setCategories] = useState<CategoryWithChild[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const replaceCategories = useCallback((newCategories) => {
    // Process and update categories
    const categoryTree: CategoryWithChild[] = mapCategoriesTree(newCategories);
    const categoryList: CategoryWithChild[] =
      flattenCategoriesTree(categoryTree);

    setLoading(false);
    setCategories(categoryList);
  }, []);

  const fetchCategories = useCallback(() => {
    setLoading(true);
    gqlFetch(categoriesQuery).then(({ categories }) => {
      if (categories?.length) {
        replaceCategories(categories);
      }
    });
  }, []);

  const updateCategories = useCallback(
    async (newCategoriesData) => {
      // Create chunk requests of 100 categories each so as to prevent timing out from server
      const categoryChunks: Category[][] = [];

      newCategoriesData.forEach((categoryData: Category, index: number) => {
        const chunkIndex = Math.floor(index / 100);
        categoryChunks[chunkIndex] = categoryChunks[chunkIndex] || [];
        categoryChunks[chunkIndex].push(categoryData);
      });

      try {
        for (let categories of categoryChunks) {
          await gqlFetch(categoriesMutation, {
            categories: categories.map(({ id, ...data }) => ({
              where: { id },
              data,
            })),
          });
        }

        fetchCategories();
      } catch (err: any) {
        setError(err);
      }
    },
    [categoriesMutation, fetchCategories]
  );

  useEffect(() => {
    fetchCategories();
  }, []);

  return (
    <CategoriesListingContext.Provider
      value={{
        categories,
        updateCategories,
        error,
        loading,
      }}
    >
      {children}
    </CategoriesListingContext.Provider>
  );
});

export const useCategoriesListing = () => useContext(CategoriesListingContext);
