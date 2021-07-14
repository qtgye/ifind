import React from 'react';
import { Link } from 'react-router-dom';
import { useDrag, useDrop } from 'react-sortly';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ProductListLink from './product-list-link';

const ItemRenderer = ({ data: { url, id, label, depth, softParent, icon, products } }) => {
  const [, drag] = useDrag();
  const [{ hovered }, drop] = useDrop(); 

  return (
    <>
      <div className="category-tree__item" data-hovered={hovered} ref={drop} data-depth={depth} data-id={id} data-soft-parent={softParent}>
        <div className="category-tree__item-info" ref={drag}>
          <div className="category-tree__drag">
            { icon && (
              <svg className="category-tree__icon"><use xlinkHref={`#${icon.replace(/_/g, '-')}`} /></svg>
            ) }
          </div>
          <div className="category-tree__details">
            <Link to={`/plugins/content-manager/collectionType/application::category.category/${id}`}>
              {label}
              <FontAwesomeIcon className='category-tree__item-edit-icon' icon='pen' />
            </Link>
          </div>
          {products?.length && <ProductListLink count={products.length} categoryId={id} /> || ''}
        </div>
      </div>
    </>
  );
};

export default ItemRenderer;