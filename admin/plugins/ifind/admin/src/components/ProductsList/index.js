import React, { useState, useEffect, useCallback, memo } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { Table, Button, Toggle } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Select, Label } from '@buffetjs/core';

import { useSourceRegion } from '../../providers/sourceRegionProvider';
import { useProductsList } from '../../providers/productsListProvider';
import { useGlobal } from '../../providers/globalProvider';
import { generatePluginLink } from '../../helpers/url';

import Pagination from '../Pagination';
import SortControls from '../SortControls';
import ProductFilters from '../ProductFilters';
import CustomRow from './_custom-row';
import ProductThumbnail from './_product-thumbnail';
import headers from './_table-headers';

import './styles.scss';

const sortOptions = [
  'position',
  'id',
  'title',
  'created_at',
  'updated_at'
];

const ProductsList = () => {
  const history = useHistory();
  const { setIsLoading } = useGlobal();
  const { sources } = useSourceRegion();
  const {
    products,
    loading,
    deleteProducts,
    // Values
    pageSize,
    sortBy,
    sortOrder,
    totalPages,
  } = useProductsList();
  const [ rows, setRows ] = useState([]); // Processed products
  const [ allSelected, setAllSelected ] = useState(false);
  const [ selectedItems, setSelectedItems ] = useState([]);
  const [ isFiltersVisible, setIsFiltersVisible ] = useState(false);

  const getUrlType = useCallback((sourceID, regionID) => {
    const matchedSource = sources.find(({ id }) => id === sourceID);
    const matchedRegion = matchedSource?.regions.find(({ id }) => id === regionID);

    if ( !matchedSource || !matchedRegion ) return '';

    return `${matchedSource.name} ${matchedRegion.name}`;
  }, [ sources ]);

  const getCategoryLabel = useCallback(([ productCategoryData ]) => {
    if ( !productCategoryData ) {
      return ''
    }

    return (
      productCategoryData.label?.length
      ? productCategoryData.label.find(label => label.language.code === 'en')?.label
        || productCategoryData.label[0].label
      : ''
    );
  }, []);

  const removeProducts = useCallback((productIDs) => {
    const noun = productIDs.length ? 'Products' : 'Product';

    strapi.lockApp();
    
    deleteProducts(productIDs)
    .then(() => strapi.unlockApp())
    .then(() => strapi.notification.toggle({
      title: `Deleted!`,
      message: `Successfully removed ${productIDs.length} ${noun.toLocaleLowerCase()}`,
    }));
  }, []);

  const confirmProductDelete = useCallback((productData) => {
    const willDeleteProduct = confirm(`
      Delete Product "${productData.title}" with id ${productData.id}?
    `);

    if ( willDeleteProduct ) {
      removeProducts([productData.id]);
    }
  }, [ removeProducts ]);

  const confirmDeleteAll = useCallback(() => {
    const toDelete = rows.filter(({ selected }) => selected).map(({ id }) => id);
    const toDeleteCount = toDelete.length;
    const willDeleteAll = confirm(`
      Delete ${toDeleteCount} product${ toDeleteCount > 1 ? 's' : '' }?
    `);

    if ( willDeleteAll ) {
      removeProducts(toDelete);
    }
  }, [ rows ]);

  // Checkbox handler
  const onSelectUnselect = useCallback((productID, isSelected) => {
    const newRows = rows.map(productRow => {
      if ( productID === productRow.id ) {
        productRow.selected = isSelected;
      }
      return productRow;
    });

    setRows(newRows);
  }, [ rows, setRows ]);

  // Process raw products data to match table data
  const processProducts = useCallback(rawProducts => {
    return rawProducts.map((product) => ({
      ...product,
      urlType: getUrlType(product.source, product.region),
      image: (<ProductThumbnail src={product.image} />),
      category: getCategoryLabel(product.categories || []),
      confirmProductDelete: () => confirmProductDelete(product),
    }))
  }, [ onSelectUnselect ]);

  // Select All handler
  const toggleAllSelected = useCallback(() => {
    setRows(rows.map(row => ({
      ...row,
      selected: !allSelected,
    })));
  }, [ rows, allSelected ]);

  // Row click handler
  const onClickRow = useCallback((e, data) => {
    console.log({ data });
  }, []);

  // Page size select handler
  const onPageSizeSelect = useCallback((page_size) => {
    history.push(generatePluginLink('', { page_size }));
  });

  // Sort Control update handler
  const onSortUpdate = useCallback(({ sort_by, order }) => {
    if ( sort_by !== sortBy || order !== sortOrder ) {
      history.push(generatePluginLink('', { sort_by, order }));
    }
  });

  useEffect(() => {
    setAllSelected(selectedItems.length === rows.length);
  }, [ selectedItems ]);

  useEffect(() => {
    setRows(processProducts(products));
  }, [ products ]);

  useEffect(() => {
    const selectedItems = rows.filter(row => row.selected).map(({ id }) => id);
    setSelectedItems(selectedItems);
  }, [ rows ]);

  useEffect(() => {
    setIsLoading(loading);
  }, [ loading ]);

  return (
    <div className="products-list row">
      <div className="products-list__controls">
        <div className="products-list__bulk-controls">
          {
            (rows.length && (
              <Button onClick={toggleAllSelected} color="secondary">
                { allSelected ? 'Unselect All' : 'Select All'}
              </Button>
            )) || ''
          }
          {
            (selectedItems.length && (
              <Button onClick={confirmDeleteAll} color="delete" icon={<FontAwesomeIcon icon='trash-alt' />}>
                Delete all selected
              </Button>
            )) || ''
          }
        </div>
        <div className="products-list__sort-controls">
          <SortControls
            options={sortOptions}
            onSortUpdate={onSortUpdate}
          />
        </div>
        <div className="products-list__filter-toggle">
          <Label>Filters:</Label>
          <Toggle
            name="toggle"
            onChange={({ target: { value } }) => setIsFiltersVisible(value)}
            value={isFiltersVisible}
          />
        </div>
      </div>
      {
        (isFiltersVisible && (
          <div className="products-list__filters col-md-12">
            <ProductFilters />
          </div>
        ) || '')
      }
      <Table
        showActionCollapse
        customRow={CustomRow}
        headers={headers}
        rows={rows}
        onSelect={onSelectUnselect}
        onClickRow={onClickRow}
      />
      <div className="products-list__page-controls">
        <div className="products-list__page-size">
          <Label htmlFor="page-size">Page Size</Label>
          <Select
            name="page-size"
            id="page-size"
            onChange={({ target: { value } }) => {
              onPageSizeSelect(Number(value));
            }}
            options={[ 1, 2, 5, 10, 20, 50, 100]}
            value={pageSize}
          />
        </div>
        <Pagination totalPages={totalPages} />
      </div>
      
    </div>
  )
};

export default memo(ProductsList);