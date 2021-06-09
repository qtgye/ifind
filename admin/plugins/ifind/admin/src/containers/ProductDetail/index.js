import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Header } from '@buffetjs/custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

import { useProduct } from '../../helpers/product';
import { validationRules, validateData } from '../../helpers/form';
import ProductForm, { useProductFormData } from '../../components/ProductForm';

const productValidationRules = {
  title: validationRules.required('Please provide a title'),
  price: validationRules.set([
    validationRules.required(),
    validationRules.number(),
    validationRules.greaterThan(0),
  ], 'Please provide a price above 0'),
  website_tab: [
    validationRules.required('Please select website tab'),
  ],
  url_type: validationRules.required('Please select URL Type'),
  url: validationRules.set([
    validationRules.required(),
    validationRules.url(),
  ], 'Please provide a URL in valid format'),
  image: validationRules.set([
    validationRules.required('Please provide an image'),
    validationRules.url('Image must be a valid URL'),
  ], 'Please provide an image in a valid URL format'),
  category: validationRules.required('Please select a category'),
};

const ProductDetail = () => {
  const {
    productData,
    updateProduct,
    addProduct,
   } = useProduct();
  const [ title, setTitle ] = useState('');
  const [ formErrors, setFormErrors ] = useState({});
  const [ productFormData, setProductFormData ] = useProductFormData();

  const saveProduct = useCallback(() => {
    const { success, errors } = validateData(productFormData, productValidationRules);

    setFormErrors(errors);

    // Don't save if validation fails
    if ( !success ) {
      return;
    }

    else {
      // Save product
      console.log('Save product to API');
    }
  }, [ productFormData, productValidationRules ]);

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
        formErrors={formErrors}
      />
    </div>
  )
};

export default memo(ProductDetail);