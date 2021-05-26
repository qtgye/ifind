import React, { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sortly, { ContextProvider, useDrag, useDrop } from 'react-sortly';
import {
  useCategories,
  getCategories,
  flattenCategoriesTree,
  mapCategoriesTree,
} from '../../helpers/categories';

import './styles.css';

const ItemRenderer = ({ data: { url, id, label, depth, softParent, ...restData }, ...restProps }) => {
  const [a, drag, ...dragRest] = useDrag();
  const [{ hovered }, drop, ...dropRest] = useDrop(); 

  return (
    <>
      <div className="category-tree__item" data-hovered={hovered} ref={drop} data-has-parent={depth > 0} data-parent-soft={softParent || null}>
        <div className="category-tree__item-info" ref={drag}>
          <div className="category-tree__drag"></div>
          <div className="category-tree__details">
            <div>{label}</div>
            <a href={url} target="_blank"><small>{url}&nbsp;</small></a>
          </div>
          <Link
            className="category-tree__edit"
            to={`/plugins/content-manager/collectionType/application::category.category/${id}`}>
            edit
          </Link>
        </div>
      </div>
    </>
  );
};

const CategoryTree = () => {
  const { categories, setCategories, loading } = useCategories();
  const [ items, setItems ] = useState([]);

  const handleChange = useCallback((newItems) => {
    setCategories(newItems);
  }, []);

  useEffect(() => {
    // - Max depth is 1 only
    // - Add softParent
    let lastParentID = null;

    categories.forEach(category => {
      if ( category.depth > 1 ) {
        category.depth = 1;
        category.softParent = lastParentID;
      } else {
        lastParentID = category.id;
      }
    });

    setItems(categories);
  }, [categories]);

  return (
    <form className="category-tree">
      {
        loading
        ? (<h3 className="pt-30">Loading...</h3>)
        : (
          <Sortly items={items} onChange={handleChange}>
            {(props) => <ItemRenderer {...props} />}
          </Sortly>
        )
      }
    </form>
  )
};

export default CategoryTree;