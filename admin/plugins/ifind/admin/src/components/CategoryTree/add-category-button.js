import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { generatePluginLink } from '../../helpers/url';

// TODO: Replace once category detail page is done
export const addCategoryDetailURL = `/plugins/content-manager/collectionType/application::category.category/create`;
// const addCategoryDetailURL = generatePluginLink('/categories/create');

export const addCategoryText = 'Add Category';

const AddCategoryButton = () => (
  <Link to={addCategoryDetailURL} className="btn btn-primary category-tree-add">
    <FontAwesomeIcon icon='plus' /> {addCategoryText}
  </Link>
);

export default AddCategoryButton;