import React, { useEffect, useCallback, useState } from 'react';

import Panel from '../Panel';
import IconSelect from '../IconSelect';

import './styles.scss';

const CategoryForm = ({ category, setProductFormData, formErrors }) => {
  // Form states
  const [ icon, setIcon ] = useState(null);

  const onIconSelect = useCallback((value) => {
    setIcon(value);
  }, []);

  useEffect(() => {
    console.log({ category });
  }, [ category ]);

  return (
    <form className='category-form row'>
      <Panel title='Category Form' className='category-form__panel category-form__panel--general'>
        <IconSelect
          id='icon'
          name='icon'
          value={icon}
          className='col-md-6'
          label='Icon'
          onChange={onIconSelect}
        />
      </Panel>
    </form>
  )
};

export default CategoryForm;