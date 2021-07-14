/**
 * NOTE: WIP
 */

import React, { useState, useEffect, useCallback, useContext, createContext } from 'react';
import { useGQLFetch } from '../helpers/gqlFetch';

const categoryFragment = `
fragment categoryFragment on Category {
  id
  parent
  language
  icon
  order
  label_preview
  region
  source
  label
  product_attrs
}
`

export const categoryQuery = `
query Category ($id: ID!) {
  category (id: $id) {
    product_attrs {
      id
      label_preview
    }
  }
}
`;

export const addCategoryMutation = `
${categoryFragment}
mutation AddCategory ($data: createCategoryInput) {
  createCategory (input: $data) {
    category {
      ... categoryFragment
    }
  }
}
`

export const CategoryContext = createContext({});

export const CategoryProvider = ({ children }) => {
  const gqlFetch = useGQLFetch();
  const [ category, setCategory ] = useState(null);
  const [ loading, setLoading ] = useState(false);
  const [ error, setError ] = useState(null);

  const addCategory = useCallback((data) => {
    setLoading(true);

    gqlFetch(addCategoryMutation, { data })
    .then(data => { console.log({ data }) })
    .catch(err => console.error(err))
    .finally(() => setLoading(false));
  }, []);

  return (
    <CategoryContext.Provider value={{
      category,
      loading,
      addCategory,
    }}>
      {children}
    </CategoryContext.Provider>
  )
}

export const useCategory = () => {
  return useContext(CategoryContext);
};