import React, { useEffect, useCallback, useState } from 'react';
import PropTypes from 'prop-types';

import Panel from '../Panel';
import IconSelect from '../IconSelect';
import TranslatedLabelsInput from '../TranslatedLabelsInput';
import CategorySelect from '../CategorySelect';
import TextInput from '../TextInput';
import AttributesFactorInput from '../AttributesFactorInput';

import { useLanguages } from '../../providers/languageProvider';
import { useProductAttributes } from '../../providers/productAttributesProvider';

import './styles.scss';

const CategoryForm = ({ category, setCategoryFormData, formErrors }) => {
  const languages = useLanguages();
  const { productAttributes } = useProductAttributes();

  // Form states
  const [ icon, setIcon ] = useState(null);
  const [ translatedLabels, setTranslatedLabels ] = useState([]);
  const [ parent, setParent ] = useState(null);
  const [ labelPreview , setLabelPreview] = useState('');
  const [ attributeFactors , setAttributeFactors] = useState([]);

  const onChange = useCallback((newData) => {
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
    setParent(parent);
  }, []);

  const onFactorsChange = useCallback((attributesFactors) => {
    setAttributeFactors(attributesFactors);
  }, []);

  const setDefaultAttributeFactors = useCallback(() => {
    setAttributeFactors(productAttributes.map(productAttr => ({
      product_attribute: productAttr.id,
      factor: 1,
    })));
  }, [ productAttributes ]);

  const onFormChange = useCallback(() => {
    // Format attribute factors to match graphql requirements
    const formattedFactors = attributeFactors.map(attrFactor => {
      const formattedFactor = {
        factor: attrFactor.factor,
        label_preview: attrFactor.label_preview,
        product_attribute: attrFactor.product_attribute.id,
      };

      if ( attrFactor.id ) {
        formattedFactor.id = attrFactor.id;
      }

      return formattedFactor;
    });

    // Format translated labels to match graphql requirements
    const formattedLabels = translatedLabels.map(({ id, language, label}) => {
      const formatedLabel = { language, label };

      if ( id ) {
        formatedLabel.id = id;
      }

      return formatedLabel;
    });

    onChange({
      icon,
      parent,
      label_preview: labelPreview,
      label: formattedLabels,
      product_attrs: formattedFactors,
    });
  }, [
    languages,
    // form data
    icon,
    translatedLabels,
    labelPreview,
    parent,
    attributeFactors,
  ]);

  useEffect(() => {
    onFormChange();
  }, [
    onFormChange,
    // form data
    icon,
    labelPreview,
    parent,
    attributeFactors,
  ]);

  useEffect(() => {
    const englishLabel = languages.find(({ code }) => code === 'en');

    // Build label_preview
    const selectedLabel = translatedLabels.find((label) => (
      englishLabel ? 
      englishLabel.id === label.language :
      label.label
    ))?.label || translatedLabels.find(({ label }) => label)?.label || '';

    setLabelPreview(selectedLabel);
  }, [ translatedLabels ]);

  useEffect(() => {
    // Edit Category
    if ( category ) {
      setIcon(category.icon);
      setTranslatedLabels(category.label.map(({ language, ...label }) => ({
        ...label, language: language.id,
      })));
      setParent(category.parent?.id);
      setLabelPreview(category.label_preview);
      setAttributeFactors(category.product_attrs);
    }
    // Create Category
    else {
      setDefaultAttributeFactors();
    }
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
      <Panel title='Attributes Factoring' className="category-form__panel category-form__panel--factoring">
        <AttributesFactorInput
          className='col-md-6'
          onChange={onFactorsChange}
          attributeFactors={attributeFactors}
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