import React, { useState, useEffect, useCallback, memo } from 'react';
import { useHistory } from 'react-router-dom';
import { Table, Button } from '@buffetjs/core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useSourceRegion } from '../../providers/sourceRegionProvider';
import { useProductsList } from '../../providers/productsListProvider';

import './styles.scss';

const headers = [
  {
    name: '',
    value: () => (
      <div className="test">TEST</div>
    )
  },
  {
    name: 'Id',
    value: 'id',
    isSortEnabled: true,
  },
  {
    name: 'Product Image',
    value: 'image',
    isSortEnabled: true,
  },
  {
    name: 'Product Name',
    value: 'title',
    isSortEnabled: true,
  },
  {
    name: 'Category',
    value: 'category',
    isSortEnabled: true,
  },
];

const ProductThumbnail = ({ src }) => (
  <img src={src} alt="" className="products-list__thumbnail" />
);

const CustomRow = ({ row: {id, title, image, category, url, selected = false, confirmProductDelete }, onSelect }) => {
  return (
    <tr>
      <td>
        <input
          className="products-list__product-checkbox"
          type="checkbox"
          checked={selected}
          onChange={({ target }) => onSelect(id, !selected)}
        />
      </td>
      <td>
        <p>{id}</p>
      </td>
      <td>
        <p>{image}</p>
      </td>
      <td>
        <p>{title}</p>
      </td>
      <td>
        <p>{category}</p>
      </td>
      <td>
        <div className="products-list__product-actions">
          {
            url && (
              <a href={url} className="products-list__product-action" target="_blank">
                <FontAwesomeIcon icon='external-link-alt' color="gray" />
              </a>
            )
          }
          <a href={`/admin/plugins/ifind/products/${id}`} className="products-list__product-action">
            <FontAwesomeIcon icon='pencil-alt' color="gray" />
          </a>
          <button className="products-list__product-action" onClick={confirmProductDelete}>
            <FontAwesomeIcon icon='trash-alt' color="orange" />
          </button>
        </div>
      </td>
    </tr>
  )
}

const ProductsList = () => {
  const history = useHistory();
  const { sources } = useSourceRegion();
  const {
    products,
    // setFilters,
    // setPage,
    // setPageSize,
    // setSortBy,
    // setSortOrder,
    refresh,
  } = useProductsList();
  const [ rows, setRows ] = useState([]); // Processed products
  const [ allSelected, setAllSelected ] = useState(false);
  const [ selectedItems, setSelectedItems ] = useState([]);

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

  const deleteProducts = useCallback((productIDs) => {
    console.log('Deleteing products', productIDs);
  }, []);

  const confirmProductDelete = useCallback((productData) => {
    const willDeleteProduct = confirm(`
      Delete Product "${productData.title}" with id ${productData.id}?
    `);

    if ( willDeleteProduct ) {
      deleteProducts([productData.id]);
    }
  }, [ deleteProducts ]);

  const confirmDeleteAll = useCallback(() => {
    const toDelete = rows.filter(({ selected }) => selected).map(({ id }) => id);
    const toDeleteCount = toDelete.length;
    const willDeleteAll = confirm(`
      Delete ${toDeleteCount} product${ toDeleteCount > 1 ? 's' : '' }?
    `);

    if ( willDeleteAll ) {
      deleteProducts(toDelete);
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

  return (
    <div className="products-list row">
      <div className="products-list__controls">
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
      <Table
        showActionCollapse
        customRow={CustomRow}
        headers={headers}
        rows={rows}
        onSelect={onSelectUnselect}
        rowLinks={[
          {
            icon: <FontAwesomeIcon icon='pencilAltl' />,
            onClick: data => {
              // history.push(`/admin/plugins/ifind/products/${}`);
              console.log(data);
            },
          },
          {
            icon: <FontAwesomeIcon icon='trashAlt' />,
            onClick: data => {
              console.log(data);
            },
          },
        ]}
      />
    </div>
  )
};

export default memo(ProductsList);