import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { useHistory } from 'react-router-dom';
import { Header } from '@buffetjs/custom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';

import { useProduct, ProductProvider } from '../../providers/productProvider';
import { validationRules, validateData } from '../../helpers/form';
import ProductForm from '../../components/ProductForm';

const productValidationRules = {
  title: validationRules.required('Please provide a title'),
  // price: validationRules.set([
  //   validationRules.required(),
  //   validationRules.number(),
  //   validationRules.greaterThan(0),
  // ], 'Please provide a price above 0'),
  website_tab: [
    validationRules.required('Please select website tab'),
  ],
  has_url_type: validationRules.required('Please select URL Type'),
  // url: validationRules.set([
  //   validationRules.required(),
  //   validationRules.url(),
  // ], 'Please provide a URL in valid format'),
  image: validationRules.set([
    validationRules.required('Please provide an image'),
    validationRules.url('Image must be a valid URL'),
  ], 'Please provide an image in a valid URL format'),
  category: validationRules.required('Please select a category'),
};

const ProductDetail = () => {
  const [
    productData,
    addProduct,
    updateProduct,
  ] = useProduct();
  const history = useHistory();
  const [ title, setTitle ] = useState('');
  const [ formErrors, setFormErrors ] = useState({});
  const [ productFormData, setProductFormData ] = useState({});
  const [ redirectOnUpdate, setRedirectOnUpdate ] = useState(false); // Useful in Create Product
  const [ hasChanges, setHasChanges ] = useState(false);
  const [ headerActions, setHeaderActions ] = useState([]);

  const saveProduct = useCallback(() => {
    // Format productFormData for validation
    if ( productFormData.source && productFormData.region ) {
      productFormData.has_url_type = true;
    }

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

      console.log({ formattedData });

      if ( !formattedData.id ) {
        setRedirectOnUpdate(true);
        addProduct(formattedData);
      }
      else {
        updateProduct(formattedData);
      }
    }
  }, [ productFormData, updateProduct, addProduct ]);
  
  const formatProductFormData = useCallback((formData) => {
    if ( formData.url_type ) {
      formData.region = formData.url_type.region;
      formData.source = formData.url_type.source;
    }

    formData.price = Number(formData.price);
    formData.categories = [ formData.category ];

    // Delete unnecessary props for graphql request
    delete formData.url_type;
    delete formData.category;
    delete formData.urlList;

    return formData;
  }, []);

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

  useEffect(() => {
    const rawProductData = productData || {};

    // Check if there are changes
    const hasChanged = Object.entries(productFormData).some(([ formKey, formValue ]) => {
      switch (formKey) {
        case 'category':
          if ( productFormData[formKey] ) {
            return !rawProductData.categories?.length
              || rawProductData.categories.find(({ id }) => id !== productFormData[formKey]);
          }
          else {
            return rawProductData.categories?.length;
          }
        case 'url_list':
          return (
            (rawProductData.url_list?.length !== productFormData.url_list?.length)
            || (
              productFormData.url_list && productFormData.url_list.some((urlData, index) => (
                !rawProductData.url_list || !rawProductData.url_list[index] ||
                Object.entries(urlData).some(([ key, value ]) => (
                  !rawProductData.url_list || !rawProductData.url_list[index]
                  || !rawProductData.url_list[index][key] != urlData[key]
                ))
              ))
            )
            || (
              rawProductData.url_list && rawProductData.url_list.some((urlData, index) => (
                !productFormData.url_list || !productFormData.url_list[index] ||
                Object.entries(urlData).some(([ key, value ]) => (
                  !productFormData.url_list || !productFormData.url_list[index]
                  || !productFormData.url_list[index][key] != urlData[key]
                ))
              ))
            )
          )
        case 'title':
        case 'website_tab':
        case 'price':
        case 'image':
          return productFormData[formKey] !== rawProductData[formKey];
        default:;
      }

      return false;
    });

    setHasChanges(hasChanged);
  }, [ productFormData, productData ]);

  return (
    <div className="product-detail">
      <div className="container">
        <div className="row">
          <Header
            title={{ label: title }}
            actions={[
              {
                label: 'Save',
                onClick: saveProduct,
                color: 'success',
                type: 'button',
                disabled: !hasChanges,
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

export default memo(() => (
  <ProductProvider>
    <ProductDetail />
  </ProductProvider>
));