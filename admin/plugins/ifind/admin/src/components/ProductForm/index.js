import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSourceRegion } from '../../providers/sourceRegionProvider';
import { InputText, Label, Select } from '@buffetjs/core';
import Panel from '../Panel';
import InputBlock from '../InputBlock';


const websiteTabOptions = [
  'home',
  'product_comparison',
  'find_tube',
];

const ProductForm = () => {
  const sourceRegionData = useSourceRegion();
  const [ sources, setSources ] = useState([]);
  const websiteTabOptionsRef = useRef(websiteTabOptions);

  // Field states
  const [ websiteTab, setWebsiteTab ] = useState('home');
  const [ title, setTitle ] = useState('');
  const [ categoryOptions, setCategoryOptions ] = useState([]);
  const [ category, setCategory ] = useState('');
  const [ subCategoryOptions, setSubCategoryOptions ] = useState([]);
  const [ subCategory, setSubCategory ] = useState('');

  useEffect(() => {
    if ( sourceRegionData.sources.length ) {
      setSources(sourceRegionData.sources);
    }
  }, [ sourceRegionData ]);

  return (
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

      {/* Category */}
      <InputBlock className="col-md-6">
        <Label htmlFor="category">Category</Label>
        <Select
          name="category"
          id="category"
          onChange={({ target: { value } }) => {
            setCategory(value);
          }}
          options={categoryOptions}
          value={category}
        />
      </InputBlock>

      {/* Sub-Category */}
      <InputBlock className="col-md-6">
        <Label htmlFor="sub-category">Sub Category</Label>
        <Select
          name="sub-category"
          id="sub-category"
          onChange={({ target: { value } }) => {
            setSubCategory(value);
          }}
          options={subCategoryOptions}
          value={subCategory}
        />
      </InputBlock>

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

    </Panel>
  )
};

export default ProductForm;