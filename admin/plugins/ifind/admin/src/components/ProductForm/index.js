import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { InputText, Label, Select, Text } from '@buffetjs/core';
import { Separator } from '@buffetjs/core';

import Panel from '../Panel';
import InputBlock from '../InputBlock';
import ImagePreview from '../ImagePreview';
import CategorySelect from '../CategorySelect';
import ProductURLInput from '../ProductURLInput';

import './styles.scss';

const _websiteTabOptions = [
  'home',
  'product_comparison',
  'find_tube',
];

const ProductForm = ({ product, setProductFormData, formErrors }) => {
  const [ websiteTabOptions ] = useState(_websiteTabOptions);

  // Read-only fields
  const [ id, setId ] = useState(null);
  const [ clicksCount, setClicksCount ] = useState(null);

  // CategorySelect Data
  const [ source, setSource ] = useState(null);
  const [ region, setRegion ] = useState(null);

  // Product URL Input Data
  const [ urlList, setUrlList ] = useState([]);

  // Field states
  const [ websiteTab, setWebsiteTab ] = useState('home');
  const [ title, setTitle ] = useState('');
  const [ category, setCategory ] = useState(null);
  const [ image, setImage ] = useState('');
  const [ position, setPosition ] = useState('');
  const [ productURLs, setProductURLs ] = useState([]); // Initial data for ProductURLInput

  // Meta states
  const [ createdOn, setCreatedOn ] = useState('');
  const [ createdBy, setCreatedBy ] = useState('');
  const [ lastModified, setLastModified ] = useState('');
  const [ lastModifiedBy, setLastModifiedBy ] = useState('');

  const collectFormData = useCallback(() => {
    return {
      id,
      websiteTab,
      title,
      category,
      image,
      source,
      region,
      urlList,
      position,
    }
  }, [
    id,
    websiteTab,
    title,
    category,
    image,
    source,
    region,
    urlList,
    position,
  ]);

  const processFormData = useCallback((formData) => {
    // Process websiteTab
    formData.website_tab = formData.websiteTab;

    // Process urlList
    formData.url_list = formData.urlList.map(({ source, region, is_base, price, url }) => ({
      source, region, is_base, url, price
    }));

    // Format Position
    formData.position = Number(formData.position);

    // Delete unnecessary props
    delete formData.urlType;
    delete formData.websiteTab;

    return formData;
  }, []);

  const onChange = useCallback(() => {
    const formData = collectFormData();
    const processedData = processFormData({...formData});
    setProductFormData(processedData);
  }, [ collectFormData, setProductFormData, processFormData ]);

  const onCategorySelect = useCallback((categoryID) => {
    setCategory(categoryID);
  }, [ setCategory ]);

   const onProductURLsChange = useCallback((newUrlList) => {
    setUrlList(newUrlList);
   }, []);

  useEffect(() => {
    if ( product ) {
      setId(product.id);
      setWebsiteTab(product.website_tab);
      setTitle(product.title);
      setImage(product.image);
      setCategory(product.categories[0]?.id);
      setClicksCount(product.clicks_count);
      setPosition(product.position);

      // Format product url list to match ProductURLInput
      setProductURLs((product.url_list || []).map(urlData => ({
        source: urlData?.source?.id,
        region: urlData?.region?.id,
        url: urlData?.url,
        is_base: urlData?.is_base,
        price: urlData?.price,
      })));

      // Update source and region based on product
      if ( product.source && product.region ) {
        setSource(product.source?.id);
        setRegion(product.region?.id);
      }

      // Set meta
      if ( product.created_at ) {
        setCreatedOn(product.created_at);
      }
      if ( product.updated_at ) {
        setLastModified(product.updated_at);
      }
    }
  }, [ product ]);

  useEffect(() => {
    onChange();
  }, [
    id,
    websiteTab,
    title,
    category,
    source,
    region,
    image,
    urlList,
    position,
  ]);

  return (
    <form className="product-form row">
      <Panel className="product-form__panel product-form__panel--general">

        {/* Website Tab */}
        <InputBlock className="col-md-6" error={formErrors.website_tab}>
          <Label htmlFor="website-tab">Website Tab</Label>
          <Select
            name="website-tab"
            id="website-tab"
            onChange={({ target: { value } }) => {
              setWebsiteTab(value);
            }}
            options={websiteTabOptions}
            value={websiteTab}
          />
        </InputBlock>

        <InputBlock className="col-md-6" >
          <Label htmlFor="change-date">Change Date</Label>
          <InputText
            name="change-date"
            id="change-date"
            value={lastModified.slice(0, 10)}
            disabled
          />
        </InputBlock>

        {/* Title */}
        <InputBlock className="col-md-12" error={formErrors.title}>
          <Label htmlFor="product-title">Title</Label>
          <InputText
              id='product-title'
              name='product-title'
              onChange={({ target: { value } }) => setTitle(value)}
              type="text"
              value={title}
            />
        </InputBlock>

        {/* Image */}
        <InputBlock className="col-md-12" error={formErrors.image}>
          <Label htmlFor="image">Image URL</Label>
          <InputText
            id='image'
            name='image'
            onChange={({ target: { value } }) => setImage(value)}
            type="text"
            value={image}
          />
        </InputBlock>

        {/* Position */}
        <InputBlock className="col-md-6">
          <Label htmlFor="website-tab">Position</Label>
          <InputText
              id='position'
              name='position'
              type="number"
              value={position}
              onChange={({ target: { value } }) => setPosition(value)}
            />
        </InputBlock>

        {/* Clicks Count */}
        <InputBlock className="col-md-6">
          <Label htmlFor="clicks-count">Clicks Count</Label>
          <InputText
              id='clicks-count'
              name='clicks-count'
              type="number"
              value={clicksCount}
              disabled
            />
        </InputBlock>

      </Panel>

      <Panel className="product-form__panel product-form__panel--urls">
        {/* URL List */}
        <ProductURLInput
          className="col-md-12"
          urls={productURLs}
          error={formErrors.url_list}
          onChange={onProductURLsChange}
        />
      </Panel>

      <Panel className="product-form__panel product-form__panel--categories">
        {/* Category */}
        <CategorySelect
          source={source}
          region={region}
          category={category}
          onChange={onCategorySelect}
          hasError={formErrors.category}
        />
        { formErrors.category && (
          <Text className="col-sm-12" size="sm" color="red">{formErrors.category.join('<br />')}</Text>
        )}
      </Panel>
      
      <Panel className="product-form__panel product-form__panel--sidebar">
        {/* Image Preview */}
        <InputBlock className="col-md-12">
          <Label>Image Preview</Label>
          <ImagePreview url={image} />
        </InputBlock>
      </Panel>

      <Panel className="product-form__panel product-form__panel--meta">
        <div className="col-md-12">
          <Text size="lg"><strong>Meta</strong></Text>
          <br />
          
          {
            lastModified ?
            <Text size="sm" color="gray">Last Modified on <strong>{lastModified}</strong></Text>
            : null
          }
          {
            createdOn ?
            <Text size="sm" color="gray">Created on <strong>{createdOn}</strong></Text>
            : null
          }
        </div>
      </Panel>

    </form>
  )
};


export default memo(ProductForm);