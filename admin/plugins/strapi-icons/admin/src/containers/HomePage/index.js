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
import { Text, Table, Row } from '@buffetjs/core';
import { Header } from '@buffetjs/custom';

import icons from '../../icons';
import './styles.css';

const FAIconsList = Object.entries(FAIcons).filter(([name, icon]) => icon.iconName).map(([ importName, icon ]) => ({
  ...icon,
  importName,
}));

console.log({ FAIconsList });

const headers = [
  {
    name: 'Preview',
    value: 'preview',
  },
  {
    name: 'Import Name',
    value: 'importName',
  },
  {
    name: 'Class Name',
    value: 'className',
  },
];

const CustomRow = ({ row }) => {
  const { preview, importName, className } = row;

  return (
    <tr>
      <td>{preview}</td>
      <td><p>{importName}</p></td>
      <td><p>{className}</p></td>
    </tr>
  )
};

const HomePage = () => {

  return (
    <div className="container">
      <Header
        title={{ label: 'Strapi Icons' }}
        content="For admin UI use only"
      />

      {/* <Table
        customRow={CustomRow}
        headers={headers}
        rows={FAIconsList.map(icon => ({
          ...icon,
          className: `fa-${icon.iconName}`,
          preview: <FontAwesomeIcon className="icons-list__item" icon={icon} size='md' />,
        }))}
      /> */}
      
      <div className="icons-list">
        {
          FAIconsList.map((icon) => (
            <div className="icons-list__item">
              <FontAwesomeIcon icon={icon} size='md' />
              <Text className="icons-list__name" color="lightBlue">{icon.importName}</Text>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default memo(HomePage);
