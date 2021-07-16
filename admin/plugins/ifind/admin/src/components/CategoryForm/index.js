import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import Panel from '../Panel';
import IconSelect from '../IconSelect';
import TranslatedLabelsInput from '../TranslatedLabelsInput';
import CategorySelect from '../CategorySelect';
import TextInput from '../TextInput';

import { useLanguages } from '../../providers/languageProvider';

import './styles.scss';

const CategoryForm = ({ category, setCategoryFormData, formErrors }) => {
  const languages = useLanguages();

  // Form states
  const [ icon, setIcon ] = useState(null);
  const [ translatedLabels, setTranslatedLabels ] = useState([]);
  const [ parent, setParent ] = useState(null);
  const [ labelPreview , setLabelPreview] = useState('');

  const onChange = useCallback((newData) => {
    console.log({ newData });

    if ( typeof setCategoryFormData === 'function' ) {
      setCategoryFormData(newData);
    }
  }, []);

  const onIconSelect = useCallback((value) => {
    setIcon(value);
  }, []);
  
  const onLabelsChange = useCallback((newLabels) => {
    setTranslatedLabels(newLabels);
  }, []);

  const onParentSelect = useCallback((parent) => {
    setParent(parent)
  }, []);

  useEffect(() => {
    const englishLabel = languages.find(({ code }) => code === 'en');

    // Build label_preview
    const selectedLabel = translatedLabels.find((label) => (
      englishLabel ? 
      englishLabel.id === label.language :
      label.label
    ))?.label || translatedLabels.find(({ label }) => label)?.label || '';

    setLabelPreview(selectedLabel);

    onChange({
      icon,
      translatedLabels,
      parent,
      labelPreview: selectedLabel,
    })
  }, [
    languages,
    // form data
    icon,
    translatedLabels,
    parent,
  ]);

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
        <TextInput
          label='Label Preview'
          className='col-md-6'
          value={labelPreview}
          disabled={true}
        />
        <TranslatedLabelsInput
          className='col-md-12'
          labels={translatedLabels}
          onChange={onLabelsChange}
        />
      </Panel>
      <Panel title='Parent Category' className="category-form__panel category-form__panel--parent">
        <CategorySelect
            category={parent}
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

CategoryForm.propTypes = {
  category: PropTypes.object, // categoryData
  setCategoryFormData: PropTypes.func,
}

export default CategoryForm;