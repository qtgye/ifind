import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers/authProvider';
import { useLanguages } from './languages';
import { useQuery, useMutation } from './query';

const categoryFieldsOverviewFragment = `
fragment CategoryFieldsOverview on Category {
  label
  id
  order
  icon
}`;

const categoryFieldsDetailsFragment = `
fragment CategoryFieldsDetails on Category {
  url
  parent {
    id
    label
  }
  language {
    id
    code
    name
  }
  products {
    id
    title
  }
}`;

const categoryFieldsCompleteFragment = `
fragment CategoryFieldsComplete on Category {
  ... CategoryFieldsOverview
  ... CategoryFieldsDetails
}`;

const updatedCategoryFieldsFragment = `
fragment UpdatedCategoryFields on updateCategoryPayload {
  category {
    ... CategoryFieldsComplete
  }
}`;


const categoriesQuery = `
${categoryFieldsOverviewFragment}
${categoryFieldsDetailsFragment}
${categoryFieldsCompleteFragment}
query GetCategories {
  categories {
    ... CategoryFieldsComplete
  }
}
`;

const categoriesMutation = (categories) => (
  `
  ${categoryFieldsOverviewFragment}
  ${categoryFieldsDetailsFragment}
  ${categoryFieldsCompleteFragment}
  ${updatedCategoryFieldsFragment}
  mutation {
    ${
      categories
      .map(({ id, ...data }, index) => `
        updateCategory${index}: updateCategory (input: {
          where: { id: ${id} },
          data: {
            ${
              Object.entries(data)
              .map(([key, value]) => `${key}: ${ typeof value === 'string' ? `"${value}"` : value }`)
              .join(',\n')
            }
          }
        }) {
          ... UpdatedCategoryFields
        }
      `)
      .join('\n')
    }
  }
  `
);

export const flattenCategoriesTree = (tree, currentDepth = 0) => {
  const list = Object.values(tree)
  // Sort items first
  .sort((catA, catB) => catA.order > catB.order ? 1 : -1)
  // Process each item
  .reduce((list, currentNode) => {
    currentNode.depth = currentDepth;

    list.push(currentNode);

    // Flat-append this item's children
    if ( currentNode.children ) {
      list.push(...flattenCategoriesTree(currentNode.children, currentDepth + 1));
      // Remove this item's children prop to avoid confusion
      delete currentNode.children;
    }
    
    return list;
  }, []);
  
  return list;
};

/**
 * Creates an object tree of categories
 * @param {array} rawCategories 
 * @returns object
 */
export const mapCategoriesTree = (rawCategories) => {
  const categoryTree = {};
  const byId = rawCategories.reduce(( all, category) => ({
    ...all,
    [category.id]: category,
  }), {});

  if ( rawCategories ) {
    rawCategories.forEach(category => {
      // Check if category has existing parent
      if ( category.parent && category.parent.id in byId ) {
        // Append to the parent's children
        byId[category.parent.id].children = byId[category.parent.id].children || {};
        byId[category.parent.id].children[category.id] = category;

        // Determine depth acc. to parent
        let currentDepthCount = 1;
        let currentParent = category.parent;
        while ( currentParent.parent ) {
          currentDepthCount++;
          currentParent = currentParent.parent;
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


export const groupCategoriesByLanguage = (categoriesList, languages) => {
  return languages.map(language => ({
    language,
    categories: categoriesList.filter(category => category.language?.id === language.id),
  }));
};


export const useCategories = () => {
  const { data } = useQuery(categoriesQuery);
  const [
    callMutation,
    {
      data: updatedCategoriesData,
      error: updateCategoriesError
    }
  ] = useMutation();
  const [ categories, setCategories ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);

  const updateCategoriesQuery = useCallback((updatedCategories) => {
    callMutation(categoriesMutation(updatedCategories));
  }, [ callMutation ]);

  const updateCategoriesList = useCallback((updatedCategoriesList) => {
    // Map updated categories by id
    const newCategoriesMap = Object.values(updatedCategoriesList)
                            .reduce((all, { category }) => {
                              all[category.id] = category;
                              return all;
                            }, {});

    // Replace matching categories with updated ones
    const updatedCategories = categories.map(category => {
      if ( category.id in newCategoriesMap ) {
      return newCategoriesMap[category.id];
      }
      return category;
    });

    // Save updated categories
    replaceCategories(updatedCategories);
  }, [ categories ]);

  const replaceCategories = useCallback((newCategories) => {
    // Process and update categories
    const categoryTree = mapCategoriesTree(newCategories);
    const categoryList = flattenCategoriesTree(categoryTree);

    setLoading(false);
    setCategories(categoryList);
  });

  useEffect(() => {
    if ( data ) {
      replaceCategories(data.categories);
    }
  }, [ data ]);

  useEffect(() => {
    if ( updatedCategoriesData ) {
      updateCategoriesList(updatedCategoriesData);
    }
  }, [ updatedCategoriesData ]);

  useEffect(() => {
    if ( updateCategoriesError ) {
      setError(updateCategoriesError);
    }
  }, [ updateCategoriesError ]);
  
  return [
    categories,
    updateCategoriesQuery,
    error,
  ];
}