import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';
import { useLanguages } from './languages';
import { useQuery, useMutation } from './query';

export const productDataFragment = `
  fragment ProductDataFragment on Product {
    title
  }
`;

export const productQuery = `
  ${productDataFragment}
  query GetProduct ($id: ID!) {
    product (id: $id) {
      ... ProductDataFragment
    }
  }
`;

export const productMutation = (product) => (
  `
  mutation {
    updateProduct (input: {
      where: { id: ${id} },
      data: {
        
      }
    }) {
      ... UpdatedProductFields
    }
  }
  `
);

export const useProduct = () => {
  const _productQuery = useRef(productQuery);
  const { productId } = useParams();
  const [ query, setQuery ] = useState(null);
  const { data } = useQuery(query, { id: productId });
  const [
    callMutation,
    {
      data: updateProductData,
      error: updateProductError
    }
  ] = useMutation();
  const [ productData, setSetProductData ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);

  const addProduct = useCallback((data) => {
    console.log('Add product', data);
  });

  const updateProduct = useCallback((data) => {
    if ( productData ) {
      // setSetProductData(data);
      console.log('Saving product', data);
    }
  }, [ productData ]);

  useEffect(() => {
    if ( productId ) {
      setQuery(_productQuery.current);
    }
  }, [ productId ]);

  useEffect(() => {
    if ( data?.product ) {
      setSetProductData(data.product);
    }
  }, [ data ]);
  
  return {
    productData,
    updateProduct,
    addProduct,
  }
}