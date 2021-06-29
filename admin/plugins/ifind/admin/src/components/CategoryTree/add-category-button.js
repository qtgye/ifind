import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const AddCategoryButton = () => (
  <Link to='/plugins/content-manager/collectionType/application::category.category/create' className="btn btn-primary category-tree-add">
    <FontAwesomeIcon icon='plus' />
    Add Category
  </Link>
);

export default AddCategoryButton;