import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
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
  const history = useHistory();
  const [ title, setTitle ] = useState('');
  const [ formErrors, setFormErrors ] = useState({});
  const [ productFormData, setProductFormData ] = useProductFormData();
  const [ redirectOnUpdate, setRedirectOnUpdate ] = useState(false); // Useful in Create Product

  const saveProduct = useCallback(() => {
    const { success, errors } = validateData(productFormData, productValidationRules);

    setFormErrors(errors);

    // Don't save if validation fails
    if ( !success ) {
      return;
    }

    // Save product
    else {
      // Prepare data for graphql request
      const formattedData = formatProductFormData(productFormData);

      if ( !formattedData.id ) {
        setRedirectOnUpdate(true);
        console.log({ formattedData });
        addProduct(formattedData);
      }
      else {
        updateProduct(formattedData);
      }
    }
  }, [ productFormData, productValidationRules, updateProduct, addProduct ]);
  
  const formatProductFormData = useCallback((productFormData) => {
    if ( productFormData.url_type ) {
      productFormData.region = productFormData.url_type.region;
      productFormData.source = productFormData.url_type.source;
    }

    productFormData.price = Number(productFormData.price);
    productFormData.categories = [ productFormData.category ];

    // Delete unnecessary props for graphql request
    delete productFormData.url_type;
    delete productFormData.category;

    return productFormData;
  });

  useEffect(() => {
    if ( !productData ) {
      setTitle('Create New Product');
    }

    else {
      if ( redirectOnUpdate ) {
        history.push('/plugins/ifind/products/' + productData.id);
      }
      else {
        setTitle(productData.title);
      }
    }
  }, [ productData ]);

  return (
    <div className="product-detail">
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
    </div>
  )
};

export default memo(ProductDetail);