import React, { useEffect, useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Header } from '@buffetjs/custom';

import { generatePluginLink } from '../../helpers/url';
import { CategoryProvider, useCategory } from '../../providers/categoryProvider';
import { useGlobal } from '../../providers/globalProvider';

import CategoryForm from '../../components/CategoryForm';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';

const CategoryDetail = () => {
  const history = useHistory();
  const { setIsLoading } = useGlobal();
  const { category, addCategory, updateCategory, loading } = useCategory();
  const [ isSaving, setIsSaving ] = useState(false);
  const [ categoryFormData, setCategoryFormData ] = useState();

  const redirectToAddCategory = useCallback(() => {
    history.push(generatePluginLink('categories/create'));
  }, []);

  const saveCategory = useCallback(() => {
    setIsSaving(true);

    if ( category?.id ) {
      updateCategory(category.id, categoryFormData);
    }
    else {
      // create category
      addCategory(categoryFormData);
    }
  }, [ categoryFormData, category, addCategory, updateCategory ]);

  useEffect(() => {
    if ( category?.id ) {
      if ( isSaving ) {
        strapi.notification.toggle({
          message: 'Category Saved!',
          timeout: 10000,
        });
        setIsSaving(false);
      }
      else {
        strapi.notification.toggle({
          message: 'Category Loaded!',
          timeout: 10000,
        });
      }
    }
  }, [ category ]);
  
  useEffect(() => {
    setIsLoading(loading);
  }, [ loading ]);

  return (
    <div className="category-detail container">
      <div className="row">
        <Header
          title={{ label: category?.label_preview || 'Create Category' }}
          actions={[
            {
              label: isSaving ? 'Saving' : 'Save',
              onClick: saveCategory,
              color: isSaving ? 'cancel' : 'success',
              type: 'button',
              icon: (
                isSaving
                ? <FontAwesomeIcon icon="spinner" pulse />
                : <FontAwesomeIcon icon="save" />
              )
            },
            category && {
              label: 'Add Category',
              onClick: redirectToAddCategory,
              color: 'primary',
              type: 'button',
              disabled: !category?.id,
              icon: <FontAwesomeIcon icon="plus" />
            },
          ].filter(Boolean)}
        />
        <CategoryForm
          category={category}
          setCategoryFormData={setCategoryFormData}
        />
      </div>
    </div>
  );
};

export default () => (
  <CategoryProvider>
    <CategoryDetail />
  </CategoryProvider>
);
