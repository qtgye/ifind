import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { generatePluginLink } from '../../helpers/url';

const AddCategoryButton = () => (
  <Link to={generatePluginLink('/categories/create')} className="btn btn-primary category-tree-add">
    <FontAwesomeIcon icon='plus' />
    Add Category
  </Link>
);

export default AddCategoryButton;