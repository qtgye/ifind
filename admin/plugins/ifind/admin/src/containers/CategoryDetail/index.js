import React, { useEffect, useCallback, memo } from 'react';
import { Header } from '@buffetjs/custom';

import { CategoryProvider, useCategory } from '../../providers/categoryProvider';
import { useGlobal } from '../../providers/globalProvider';

import CategoryForm from '../../components/CategoryForm';

const CategoryDetail = () => {
  const { setIsLoading } = useGlobal();
  const { category } = useCategory();

  useEffect(() => {
    setIsLoading(false);
  }, []);

  return (
    <div className="category-detail container">
      <div className="row">
        <Header
          title={{ label: 'Create Category'}}
        />
        <CategoryForm category={category} />
      </div>
    </div>
  );
};

export default () => (
  <CategoryProvider>
    <CategoryDetail />
  </CategoryProvider>
);
