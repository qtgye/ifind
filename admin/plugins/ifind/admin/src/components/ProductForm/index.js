import React, { useState, useEffect, useCallback, useRef, memo } from 'react';
import { InputText, Label, Select, Text } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';

import { useSourceRegion } from '../../helpers/sourceRegion';
import { useCategories, mapCategoriesTree, buildCategoryPath } from '../../helpers/categories';

import Panel from '../Panel';
import InputBlock from '../InputBlock';
import ImagePreview from '../ImagePreview';
import NestedCategoryOption from '../NestedCategoryOption';

const _websiteTabOptions = [
  'home',
  'product_comparison',
  'find_tube',
];

const ProductForm = ({ product, setProductFormData, formErrors }) => {
  const { sources } = useSourceRegion();
  const [ categories ] = useCategories();
  const [ websiteTabOptions ] = useState(_websiteTabOptions);
  const [ urlTypeOptions, setUrlTypeOptions ] = useState([]);

  // Read-only fields
  const [ id, setId ] = useState(null);
  const [ position, setPosition ] = useState(null);
  const [ createdAt, setCreatedAt ] = useState('');
  const [ createdBy, setCreatedBy ] = useState('');
  const [ updatedAt, setUpdatedAt ] = useState('');
  const [ updatedBy, setUpdatedBy ] = useState('');

  // Nested category data
  const [ categoryPath, setCategoryPath ] = useState([]);
  const [ categoryOptions, setCategoryOptions ] = useState([]); // source-region-filtered categories

  // Field states
  const [ websiteTab, setWebsiteTab ] = useState('home');
  const [ title, setTitle ] = useState('');
  const [ category, setCategory ] = useState(null);
  const [ urlType, setUrlType ] = useState('');
  const [ url, setUrl ] = useState('');
  const [ price, setPrice ] = useState(0);
  const [ image, setImage ] = useState('');

  const collectFormData = useCallback(() => {
    return {
      id,
      websiteTab,
      title,
      category,
      urlType,
      price,
      image,
      url,
    }
  }, [
    id,
    websiteTab,
    title,
    category,
    urlType,
    price,
    image,
    url,
    urlType
  ]);

  const processFormData = useCallback((formData) => {
    // Process urlType into region and source
    if ( formData.urlType ) {
      const matchedUrlTypeOption = urlTypeOptions.find(({ label }) => label === formData.urlType);
      if ( matchedUrlTypeOption ) {
        formData.url_type = {
          region: matchedUrlTypeOption.region,
          source: matchedUrlTypeOption.source,
        };
      }
    }
    // Process price to ensure Number type
    if ( formData.price ) {
      formData.price = Number(formData.price);
    }

    // Process websiteTab
    formData.website_tab = formData.websiteTab;

    // Delete unnecessary props
    delete formData.urlType;
    delete formData.websiteTab;

    return formData;
  }, [ urlTypeOptions ]);

  const onChange = useCallback(() => {
    const formData = collectFormData();
    const processedData = processFormData({...formData});
    setProductFormData(processedData);
  }, [ collectFormData, setProductFormData, processFormData ]);

  const onCategorySelect = useCallback((categoryID) => {
    setCategory(categoryID);
  }, [ setCategory ]);

  const setInitialCategoryPath = useCallback(() => {
    // Build category path
    const categoryPath = buildCategoryPath(category, categories);
    // Use only id's for path
    setCategoryPath(categoryPath.map(({ id }) => id));
  }, [ category, categories ]);

  useEffect(() => {
    if ( product ) {
      setId(product.id);
      setWebsiteTab(product.website_tab);
      setTitle(product.title);
      setUrl(product.url);
      setPrice(product.price);
      setImage(product.image);
      setPosition(product.position);
      setCategory(product.categories[0]?.id);

      // Find url_type based on source and region
      if ( product.source && product.region ) {
        const matchedUrlType = urlTypeOptions.find(urlType => (
          urlType.source === product.source.id && urlType.region === product.region.id
        ));
        matchedUrlType && setUrlType(matchedUrlType.label);
      }
    }
  }, [ product, urlTypeOptions ]);

  useEffect(() => {
    onChange();
  }, [
    id,
    websiteTab,
    title,
    category,
    urlType,
    price,
    image,
    url,
  ]);

  useEffect(() => {
    if ( category ) {
      setInitialCategoryPath();
    }
  }, [ category ]);

  useEffect(() => {
    const urlTypeOptions = [''];

    if ( sources?.length ) {
      const sourceRegionOptions = sources.reduce((sources, source) => ([
        ...sources,
        ...(source.regions || []).map(region => ({
          source: source.id,
          region: region.id,
          label: `${source.name} ${region.name}`,
        }))
      ]), []);

      urlTypeOptions.push(...sourceRegionOptions);
    }

    setUrlTypeOptions(urlTypeOptions);
  }, [ sources ]);

  useEffect(() => {
    if ( urlType && categories?.length ) {
      // Filter to use only categories with the selected urlType
      const matchedUrlType = urlTypeOptions.find(urlTypeOption => (
        urlTypeOption.label === urlType
      ));
      const filteredCateogories = (matchedUrlType && categories.filter(category => (
        category.source?.id === matchedUrlType.source &&
        category.region?.id === matchedUrlType.region
      ))) || [];

      const categoryTree = mapCategoriesTree(filteredCateogories);
      setCategoryOptions(Object.values(categoryTree));
    }
    else {
      setCategoryOptions([]);
    }
  }, [ categories, urlType, urlTypeOptions ]);

  return (
    <form className="row">
      <Panel className="col-md-8">

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
        
        {/* Position */}
        <InputBlock className="col-md-6">
          <Label htmlFor="website-tab">Position</Label>
          <InputText
              id='position'
              name='position'
              type="number"
              value="0"
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

        {/* URL Type */}
        <InputBlock className="col-md-3" error={formErrors.url_type}>
          <Label htmlFor="url-type">URL Type</Label>
          <Select
            name="url-type"
            id="url-type"
            onChange={({ target: { value } }) => {
              setUrlType(value);
            }}
            options={urlTypeOptions.map((urlType) => (urlType && urlType.label) || '')}
            value={urlType}
          />
        </InputBlock>

        {/* URL */}
        <InputBlock className="col-md-9" error={formErrors.url}>
          <Label htmlFor="url">URL</Label>
          <InputText
            id='url'
            name='url'
            onChange={({ target: { value } }) => setUrl(value)}
            type="text"
            value={url}
          />
        </InputBlock>

        {/* Price */}
        <InputBlock className="col-md-3" error={formErrors.price}>
          <Label htmlFor="price">Price</Label>
          <InputText
            id='price'
            name='price'
            onChange={({ target: { value } }) => setPrice(value)}
            step=".01"
            type="number"
            value={price}
          />
        </InputBlock>

        {/* Image */}
        <InputBlock className="col-md-9" error={formErrors.image}>
          <Label htmlFor="image">Image URL</Label>
          <InputText
            id='image'
            name='image'
            onChange={({ target: { value } }) => setImage(value)}
            type="text"
            value={image}
          />
        </InputBlock>

      </Panel>

      <Panel className="col-md-4">
        {/* Image Preview */}
        <InputBlock className="col-md-12">
          <Label>Image Preview</Label>
          <ImagePreview url={image} />
        </InputBlock>

        {/* Category Options */}
        <NestedCategoryOption
          categories={categoryOptions}
          categoryPath={categoryPath}
          onChange={onCategorySelect}
          hasError={formErrors.category}
        />
        { formErrors.category && (
          <Text className="col-sm-12" size="sm" color="red">{formErrors.category.join('<br />')}</Text>
        )}
      </Panel>

      <hr />

      <Panel className="col-md-12">
        <div className="col-md-12">
          <Text size="lg"><strong>Meta</strong></Text>
          <br />
          <Text size="sm" color="gray">Last Modified on <strong>last_modified</strong> by <strong><em>author_name</em></strong></Text>
          <Text size="sm" color="gray">Created on <strong>date_created</strong> by <strong><em>author_name</em></strong></Text>
        </div>
      </Panel>

    </form>
  )
};


export default memo(ProductForm);