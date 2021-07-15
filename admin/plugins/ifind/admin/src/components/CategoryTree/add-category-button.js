import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { generatePluginLink } from '../../helpers/url';

// TODO: Replace once category detail page is done
const addCategoryDetailURL = `/plugins/content-manager/collectionType/application::category.category/create`;
// const addCategoryDetailURL = generatePluginLink('/categories/create');

const AddCategoryButton = () => (
  <Link to={addCategoryDetailURL} className="btn btn-primary category-tree-add">
    <FontAwesomeIcon icon='plus' />
    Add Category
  </Link>
);

export default AddCategoryButton;