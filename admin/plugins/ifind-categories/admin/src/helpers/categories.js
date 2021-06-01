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
  const list = Object.values(tree).reduce((list, currentNode) => {
    currentNode.depth = currentDepth;
    
    list.push(currentNode);
    
    if ( currentNode.children ) {
      list.push(...flattenCategoriesTree(currentNode.children, currentDepth + 1));
    }
    
    return list;
  }, []);
  
  return list;
};

export const mapCategoriesTree = (rawCategories) => {
  const categoryTree = {};
  const byId = rawCategories.reduce(( all, category) => ({
    ...all,
    [category.id]: category,
  }), {});


  if ( rawCategories ) {

    // Get parent categories first
    rawCategories
    .filter(category => category.parent)
    .forEach(childCategory => {
      categoryTree[childCategory.parent.id] = categoryTree[childCategory.parent.id] || {
        ...byId[childCategory.parent.id],
        children: {}
      };
    });

    // Add child categories
    rawCategories.forEach(category => {
      // Check if category parent exists in categoryTree
      if ( category.parent && category.parent.id in categoryTree ) {
        categoryTree[category.parent.id].children[category.id] = category;
      }
      else {
        categoryTree[category.id] = categoryTree[category.id] || {
          ...category,
          children: {}
        };
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