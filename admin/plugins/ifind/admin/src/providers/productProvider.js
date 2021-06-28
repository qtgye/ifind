import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '../helpers/query';

export const ProductContext = createContext([]);

export const productDataFragment = `
fragment ProductDataFragment on Product {
  id
  title
  image
  position
  clicks_count
  website_tab
  amazon_url
  price
  url_list {
    source {
      id
      button_logo {
        url
      }
    }
    region { id }
    url
    price
    is_base
  }
  categories {
    id
  }
  region {
    id
  }
  created_at
  updated_at
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

export const productMutationCommonAguments = `
$image: String!
$title: String!
$website_tab: String!
$categories: [ID!]!
$position: Int
$amazon_url: String!
$price: Float
`;

export const productMutationCommonInput = `
image: $image
title: $title
website_tab: $website_tab
categories: $categories
amazon_url: $amazon_url
price: $price
url_list: $url_list
position: $position
`;

export const updateProductMutation = `
${productDataFragment}
mutation UpdateProduct (
  $id: ID!
  ${productMutationCommonAguments}
  $url_list: [editComponentAtomsUrlWithTypeInput]
)
{
  updateProduct (
    input: {
      where: {
        id: $id
      }
      data: {
        ${productMutationCommonInput}
      }
    }
  )
  {
    product {
      ... ProductDataFragment
    }
  }
}
`;

export const addProductMutation = `
${productDataFragment}
mutation CreateProduct (
  ${productMutationCommonAguments}
  $url_list: [ComponentAtomsUrlWithTypeInput]
){
  createProduct (input: {
    data: {
      ${productMutationCommonInput}
    }
  }) {
    product {
      ... ProductDataFragment
    }
  }
}
`

export const ProductProvider = ({ children }) => {
  const { productId } = useParams();
  const [ getProductQuery, setGetProductQuery ] = useState(null);
  const { data: queryData, loading: queryLoading } = useQuery(getProductQuery, { id: productId });
  const [
    addOrUpdateProduct,
    {
      // loading,
      error: mutationError,
      data: mutationData,
    }
  ] = useMutation();
  const [ productData, setProductData ] = useState(null);
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  
  const addProduct = useCallback((data) => {
    addOrUpdateProduct(addProductMutation, data);
  }, []);
  
  const updateProduct = useCallback((data) => {
    if ( data?.id ) {
      addOrUpdateProduct(updateProductMutation, data);
    }
  }, [ updateProductMutation ]);
  
  useEffect(() => {
      setGetProductQuery(productQuery);
  }, [ productId ]);
  
  useEffect(() => {
    if ( queryData?.product ) {
      setProductData(queryData.product);
    }
  }, [ queryData ]);
  
  useEffect(() => {
    if ( mutationData?.createProduct?.product ) {
      setProductData(mutationData.createProduct.product);
    }
    else if ( mutationData?.updateProduct?.product ) {
      setProductData(mutationData.updateProduct.product);
    }
  }, [ mutationData ]);

  useEffect(() => {
    if ( mutationError ) {
      console.error(mutationError);
      setError(mutationError);
    }
  }, [ mutationError ]);

  return (
    <ProductContext.Provider value={[
      productData,
      addProduct,
      updateProduct,
      error,
      queryLoading,
    ]}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProduct = () => useContext(ProductContext);