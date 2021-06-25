import React from 'react';
import { Link } from 'react-router-dom';

const ProductListLink = ({ count = 0, categoryId }) => (
  <Link
    className="category-tree__products-link"
    to={`/plugins/content-manager/collectionType/application::product.product?page=1&_sort=url:ASC&_where[0][category.id]=${categoryId}`}>
    {count} Product(s)
  </Link>
);

export default ProductListLink;