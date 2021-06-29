import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const EditCategoryButton = ({ id }) => (
  <Link
    className="category-tree__edit"
    to={`/plugins/content-manager/collectionType/application::category.category/${id}`}>
    <FontAwesomeIcon icon='pen' />
  </Link>
);

export default EditCategoryButton;