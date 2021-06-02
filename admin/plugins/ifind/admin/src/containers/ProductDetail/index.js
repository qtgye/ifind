import React, { memo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useProduct } from '../../helpers/product';

import { Header } from '@buffetjs/custom';

const ProductDetail = () => {
  const {
    productData,
    updateProduct,
    addProduct,
   } = useProduct();
  const [ title, setTitle ] = useState('');

  useEffect(() => {
    if ( productData ) {
      console.log({ productData });
      setTitle(productData.title);
    }
    else {
      setTitle('Create New Product');
    }
  }, [productData]);

  return (
    <div className="container">
      <div className="row">
        <Header
          title={{ label: title }}
          actions={[
            {
              label: 'Save',
              onClick: () => history.push(`/plugins/${pluginId}/products/create`),
              color: 'primary',
              type: 'submit',
              icon: 'save'
            },
          ]}
        />
      </div>
    </div>
  )
};

export default memo(ProductDetail);