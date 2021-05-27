import React, { useState, useEffect } from 'react';
import { useAuth } from '../providers/authProvider';
import { useLanguages } from './languages';
import { useQuery } from './query';

const categoriesQuery = `
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
    language {
      id
      code
      name
    }
  }
}
`;

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


export const groupCategoriesByLanguage = (categoriesList, languages) => {
  return languages.map(language => ({
    language,
    categories: categoriesList.filter(category => category.language?.id === language.id),
  }));
};


export const useCategories = () => {
  const [ categories, setCategories ] = useState([]);
  const [ loading, setLoading ] = useState(true);
  const { data } = useQuery(categoriesQuery);

  useEffect(() => {
    if ( data ) {
      const categoryTree = mapCategoriesTree(data.categories);
      const categoryList = flattenCategoriesTree(categoryTree);

      setLoading(false);
      setCategories(categoryList);
    }
  }, [ data ]);
  
  return {
    categories,
    loading
  };
}