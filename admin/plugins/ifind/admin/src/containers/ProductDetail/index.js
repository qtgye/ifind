import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@buffetjs/custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

import { useProduct } from '../../helpers/product';
import ProductForm, { useProductFormData } from '../../components/ProductForm';

const ProductDetail = () => {
  const {
    productData,
    updateProduct,
    addProduct,
   } = useProduct();
  const [ title, setTitle ] = useState('');
  const [ productFormData, setProductFormData ] = useProductFormData();

  const saveProduct = useCallback(() => {
    console.log({ productFormData });
  }, [ productFormData ]);

  useEffect(() => {
    if ( productData ) {
      setTitle(productData.title);
    }
    else {
      setTitle('Create New Product');
    }
  }, [ productData ]);

  return (
    <div className="container">
      <div className="row">
        <Header
          title={{ label: title }}
          actions={[
            {
              label: 'Save',
              onClick: () => saveProduct(),
              color: 'success',
              type: 'button',
              icon: (<FontAwesomeIcon icon={faSave} />)
            },
          ]}
        />
      </div>
      <ProductForm
        product={productData}
        setProductFormData={setProductFormData}
      />
    </div>
  )
};

export default memo(ProductDetail);