import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/authProvider';

export const getCategories = (jwt) => {
  return window.fetch(`/graphql`, {
    method: 'post',
    headers: {
      authorization: `Bearer ${jwt}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      operationName: "GetCategories",
      query: `
        query GetCategories {
          categories {
            label
            url
            slug
            id
            parent {
              id
              label
            }
          }
        }
      `,
      variables: {}
    })
  })
  .then(res => res.json());
};

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

  if ( rawCategories ) {
    rawCategories.forEach(category => {
      if ( category.parent ) {
        categoryTree[category.parent.id] = categoryTree[category.parent.id] || { children: {}};
        categoryTree[category.parent.id].children[ category.id ] = category;
      }
      else {
        categoryTree[category.id] = categoryTree[category.id] || { children: {}};
        categoryTree[category.id] = {
          ...categoryTree[category.id],
          ...category
        }
      }
    });
  }

  return categoryTree;

};

export const useCategories = () => {
  const { jwt } = useAuth();
  const [ categories, setCategories ] = useState([]);
  const [ loading, setLoading ] = useState(true);

  useEffect(() => {
    if ( !jwt ) {
      return;
    }

    setLoading(true);

    getCategories(jwt)
    .then((rawData) => {
      if ( rawData?.data ) {
        const categoryTree = mapCategoriesTree(rawData.data.categories);
        const categoryList = flattenCategoriesTree(categoryTree);

        setLoading(false);
        setCategories(categoryList);
      }
    });
  }, [ jwt ]);

  return {
    categories,
    setCategories,
    loading
  };
}