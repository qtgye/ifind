/*
 *
 * HomePage
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import pluginId from '../../pluginId';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as FAIcons from '@fortawesome/free-solid-svg-icons';
import { Text } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';

import icons from '../../icons';
import './styles.css';

const FAIconsList = Object.values(FAIcons).filter(icon => icon.iconName);

const HomePage = () => {

  return (
    <div className="container">
      <Header
        title={{ label: 'Strapi Icons' }}
        content="For admin UI use only"
      />
      
      <div className="icons-list">
        { FAIconsList.map(icon => (
          <div className="icons-list__item">
            <FontAwesomeIcon icon={icon} size='md' />
            <Text>{icon.iconName}</Text>
          </div>
        )) }
      </div>
    </div>
  );
};

export default memo(HomePage);
