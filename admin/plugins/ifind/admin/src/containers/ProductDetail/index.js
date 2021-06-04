import React, { memo, useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@buffetjs/custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faSave, faPen, faSpinner, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons';

import { useProduct } from '../../helpers/product';
import ProductForm from '../../components/ProductForm';

const ProductDetail = () => {
  const {
    productData,
   } = useProduct();
  const [ title, setTitle ] = useState('');

  useEffect(() => {
    if ( productData ) {
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
              color: 'success',
              type: 'button',
              icon: (<FontAwesomeIcon icon={faSave} />)
            },
          ]}
        />
      </div>
      <ProductForm />
    </div>
  )
};

export default memo(ProductDetail);