import React, { useEffect, useCallback, useState } from 'react';

import Panel from '../Panel';
import IconSelect from '../IconSelect';
import TranslatedLabelsInput from '../TranslatedLabelsInput';
import CategorySelect from '../CategorySelect';

import './styles.scss';

const CategoryForm = ({ category, setProductFormData, formErrors }) => {
  // Form states
  const [ icon, setIcon ] = useState(null);
  const [ translatedLabels, setTranslatedLabels ] = useState([]);
  const [ parent, setParent ] = useState(null);

  const onIconSelect = useCallback((value) => {
    setIcon(value);
  }, []);
  
  const onLabelsChange = useCallback((newLabels) => {
    setTranslatedLabels(newLabels);
  }, []);

  const onParentSelect = useCallback((parent) => {
    console.log({ parent });
  }, []);

  useEffect(() => {
    console.log({ category });
  }, [ category ]);

  return (
    <form className='category-form row'>
      <Panel title='General' className='category-form__panel category-form__panel--general'>
        <IconSelect
          id='icon'
          name='icon'
          value={icon}
          className='col-md-6'
          label='Icon'
          onChange={onIconSelect}
        />
        <TranslatedLabelsInput
          className='col-md-12'
          labels={translatedLabels}
          onChange={onLabelsChange}
        />
      </Panel>
      <Panel title='Parent Category' className="category-form__panel category-form__panel--parent">
        <CategorySelect
            category={category}
            onChange={onParentSelect}
            exclude={category?.id ? [category?.id] : []}
            allowParent={true}
          // hasError
          // emptyMessage
        />
      </Panel>
    </form>
  )
};

export default CategoryForm;