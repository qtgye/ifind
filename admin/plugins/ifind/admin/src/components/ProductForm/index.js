import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSourceRegion } from '../../helpers/sourceRegion';
import { useCategories, mapCategoriesTree } from '../../helpers/categories';
import { InputText, Label, Select } from '@buffetjs/core';
import Panel from '../Panel';
import InputBlock from '../InputBlock';
import ImagePreview from '../ImagePreview';


const websiteTabOptions = [
  'home',
  'product_comparison',
  'find_tube',
];


const NestedCategoryOption = ({ categories, activeCategory = null, setFinalCategory = null, isChildren }) => {
  const [ id ] = useState(Math.random() * 1000);
  const [ categoryOptions, setCategoryOptions ] = useState([]);
  const [ selectedCategory, setSelectedCategory ] = useState(activeCategory);
  const [ children, setChildren  ] = useState(null);

  const categoryLabel = useCallback((categoryData) => (
    `${categoryData.label} (${categoryData.id})`
  ), []);

  const setFinalSelectedCategory = useCallback((categoryID) => {
    if ( typeof setFinalCategory === 'function' ) {
      setFinalCategory(categoryID);
    }
  }, [ setFinalCategory ]);

  useEffect(() => {
    console.log({ categories });

    const processedCategories = categories.map(category => ({
      label: categoryLabel(category),
      id: category.id,
      category
    }));

    setCategoryOptions([
      '',
      ...processedCategories
    ]);

    // Clear selections
    setFinalSelectedCategory(null);
    setChildren(null);
    setSelectedCategory(null);

  }, [ categories ]);

  useEffect(() => {
    const matchedCategory = categoryOptions.find(categoryOption => (
      selectedCategory === categoryOption.label
    ));

    console.log({ selectedCategory, matchedCategory, categoryOptions });

    if ( matchedCategory ) {
      if ( matchedCategory?.category?.children ) {
        setChildren(Object.values(matchedCategory.category.children));
      } else {
        setChildren(null);
      }
    } else {
      setChildren(null);
      setFinalSelectedCategory(null);
    }
  }, [ selectedCategory ]);

  return (
    <>
      <InputBlock className="col-md-12">
        <Label htmlFor="category">{isChildren ? 'Subcategory' : 'Category'}</Label>
        <Select
          name="category"
          id="category"
          onChange={({ target: { value } }) => {
            setSelectedCategory(value);
          }}
          options={categoryOptions.map(option => option?.label || '')}
          value={selectedCategory}
        />
      </InputBlock>
      {
        (children && (
          <NestedCategoryOption
            categories={children}
            setFinalCategory={setFinalCategory}
            isChildren={true}
            />
        ))
      }
    </>
  )
}


const ProductForm = () => {
  const { sources } = useSourceRegion();
  const [ categories ] = useCategories();
  const websiteTabOptionsRef = useRef(websiteTabOptions);
  const [ urlTypeOptions, setUrlTypeOptions ] = useState([]);
  const [ categoryOptions, setCategoryOptions ] = useState([]);

  // Field states
  const [ websiteTab, setWebsiteTab ] = useState('home');
  const [ title, setTitle ] = useState('');
  const [ category, setCategory ] = useState('');
  const [ urlType, setUrlType ] = useState('');
  const [ price, setPrice ] = useState(0);
  const [ image, setImage ] = useState('');

  const [ subCategoryOptions, setSubCategoryOptions ] = useState([]);
  const [ subCategory, setSubCategory ] = useState('');

  useEffect(() => {
    if ( sources?.length ) {
      const sourceRegionOptions = sources.reduce((sources, source) => ([
        ...sources,
        ...(source.regions || []).map(region => ({
          source: source.id,
          region: region.id,
          label: `${source.name} ${region.name}`,
        }))
      ]), []);

      setUrlTypeOptions(sourceRegionOptions);
    }
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
  }, [ categories, urlType, urlTypeOptions ]);

  return (
    <div className="row">
      <Panel className="col-md-8">

        {/* Website Tab */}
        <InputBlock className="col-md-6">
          <Label htmlFor="website-tab">Website Tab</Label>
          <Select
            name="website-tab"
            id="website-tab"
            onChange={({ target: { value } }) => {
              setWebsiteTab(value);
            }}
            options={websiteTabOptionsRef.current}
            value={websiteTab}
          />
        </InputBlock>

        <br />

        {/* Title */}
        <InputBlock className="col-md-12">
          <Label htmlFor="product-title">Title</Label>
          <InputText
              id='product-title'
              name='product-title'
              onChange={({ target: { value } }) => {
                setTitle(value);
              }}
              type="text"
              value={title}
            />
        </InputBlock>

        {/* URL Type */}
        <InputBlock className="col-md-3">
          <Label htmlFor="url-type">URL Type</Label>
          <Select
            name="url-type"
            id="url-type"
            onChange={({ target: { value } }) => {
              setUrlType(value);
            }}
            options={urlTypeOptions.map(({ label }) => label)}
            value={urlType}
          />
        </InputBlock>

        {/* URL */}
        <InputBlock className="col-md-9">
          <Label htmlFor="url">URL</Label>
          <InputText
            id='url'
            name='url'
            onChange={({ target: { value } }) => {
              setTitle(value);
            }}
            type="url"
            value={title}
          />
        </InputBlock>

        {/* Price */}
        <InputBlock className="col-md-3">
          <Label htmlFor="price">Price</Label>
          <InputText
            id='price'
            name='price'
            onChange={({ target: { value } }) => {
              setPrice(value);
            }}
            step=".01"
            type="number"
            value={price}
          />
        </InputBlock>

        {/* Price */}
        <InputBlock className="col-md-9">
          <Label htmlFor="image">Image URL</Label>
          <InputText
            id='image'
            name='image'
            onChange={({ target: { value } }) => {
              console.log({ value });
              setImage(value);
            }}
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
          setFinalCategory={(selectedCat) => {
            console.log('Selected Category', selectedCat);
            // setCategory()
          }}
        />
      </Panel>
    </div>
  )
};

export default ProductForm;