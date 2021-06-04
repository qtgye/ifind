/*
 *
 * HomePage
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';
import CategoryTree from '../../components/CategoryTree';
import DragAndDropProvider from '../../providers/dragAndDropProvider';

import { Header } from '@buffetjs/custom';

import './styles.css';


const Categories = () => {
  return (
    <div className="container">
      <div className="row">
        <Header
          title={{ label: 'Categories Management' }}
        />
      </div>
      <CategoryTree />
    </div>
  );
};

export default memo(Categories);
