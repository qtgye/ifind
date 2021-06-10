import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useAuth } from '../providers/authProvider';
import { useLanguages } from './languages';
import { validationRules } from './form';
import { useQuery, useMutation } from './query';

export const productDataFragment = `
fragment ProductDataFragment on Product {
  id
  title
  url
  price
  image
  position
  website_tab
  categories {
    id
  }
  source {
    id
  }
  region {
    id
  }
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

export const addProductMutation = `
${productDataFragment}
mutation CreateProduct (
  $url: String!
  $image: String!
  $title: String!
  $website_tab: String!
  $source: ID!
  $region: ID!
  $price: Float!
  $categories: [ID!]!
  ){
    createProduct (input: {
      data: {
        url: $url
        image: $image
        title: $title
        website_tab: $website_tab
        source: $source
        region: $region
        categories: $categories
        price: $price
      }
    }) {
      product {
        ... ProductDataFragment
      }
    }
  }
  `

export const useProduct = () => {
  const { productId } = useParams();
  const [ getProductQuery, setGetProductQuery ] = useState(null);
  const [ productMutationQuery, setProductMutationQuery ] = useState(null);
  const { data: queryData, refetch } = useQuery(getProductQuery, { id: productId });
  const [
    addOrUpdateProduct,
    {
      // loading,
      // error,
      data: mutationData,
    }
  ] = useMutation();
  const [
    callMutation,
    {
      data: updateProductData,
      error: updateProductError
    }
  ] = useMutation();
  const [ productData, setProductData ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  
  const addProduct = useCallback((data) => {
    addOrUpdateProduct(addProductMutation, data);
  });
  
  const updateProduct = useCallback((data) => {
    if ( data ) {
      console.log('Updating product', data);
    }
  });
  
  useEffect(() => {
    if ( productId ) {
      console.log({ productId });
      setGetProductQuery(productQuery);
    }
  }, [ productId, refetch, productQuery ]);
  
  useEffect(() => {
    if ( queryData?.product ) {
      setProductData(queryData.product);
    }
  }, [ queryData ]);
  
  useEffect(() => {
    if ( mutationData?.createProduct?.product ) {
      setProductData(mutationData.createProduct.product);
    }
  }, [ mutationData ]);
  
  return {
    productData,
    updateProduct,
    addProduct,
  }
};