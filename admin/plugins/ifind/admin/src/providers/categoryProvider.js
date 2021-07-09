/**
 * NOTE: WIP
 */

import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useGQLFetch } from '../helpers/gqlFetch';

export const categoryQuery = `
query Category ($id: ID!) {
  category (id: $id) {
    product_attrs {
      id
      label_preview
    }
  }
}
`

export const CategoryContext = createContext({});

export const CategoryProvider = ({ children }) => {
  const gqlFetch = useGQLFetch();
  const [ query, setQuery ] = useState(null);
  const [ variables, setVariables ] = useState({});

  const fetchCategory = useCallback((categoryID) => {
    gqlFetch()
    setVariables({ id: categoryID });
    refetch();
  }, []);

  return (
    <CategoryContext.Provider value={{
      categoryData,
      fetchCategory,
    }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategory = (categoryID) => {
  const { categoryData, fetchCategory } = useContext(CategoryContext);

  useEffect(() => {
    if ( categoryID ) {
      fetchCategory(categoryID);
    }
  }, [ categoryID ]);

  return categoryData;
}