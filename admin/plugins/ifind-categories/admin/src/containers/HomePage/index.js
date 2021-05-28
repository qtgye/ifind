/*
 *
 * HomePage
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import CategoryTree from '../../components/CategoryTree';

import './styles.css';


const HomePage = () => {
  return (
    <div className="container">
      <div className="row">
        <h1 className="category-tree-heading col-md-12">
          IFIND Categories
        </h1>
      </div>
      <div className="row">
        <div className="col-md-6">
          <CategoryTree />
        </div>
      </div>
    </div>
  );
};

export default memo(HomePage);
