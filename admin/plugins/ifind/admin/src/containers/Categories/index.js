/*
 *
 * HomePage
 *
 */

import React from 'react';
import CategoryTree from '../../components/CategoryTree';

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

export default Categories;
