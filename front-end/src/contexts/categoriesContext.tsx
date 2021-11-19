import React, { createContext, useEffect, useContext, useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { apiSourceHandle } from '@config/adminApi';
import getCategoryTree from '@gql/getCategoryTreeQuery';
import { locale as language } from '@config/locale';

export const CategoriesContext = createContext<CategoriesContextData>({});

export const CategoriesContextProvider = ({ children }: React.PropsWithChildren<React.ReactNode>) => {
    const [categoryTree, setCategoryTree] = useState<(CategoryWithChild | null)[]>([]);
    const [subCategories, setSubCategories] = useState<(CategoryWithChild | null)[]>([]);

    const {
        data,
        // loading,
        // error
    } = useQuery(getCategoryTree, {
        variables: { language },
        context: {
            apiSource: apiSourceHandle,
        }
    });

    useEffect(() => {
        if (data?.categoryTree) {
            setCategoryTree(data.categoryTree);
        }
    }, [data]);

    useEffect(() => {
        if (categoryTree?.length) {
            setSubCategories(categoryTree[0]?.children || []);
        }
    }, [categoryTree]);

    return (
        <CategoriesContext.Provider value={{ categoryTree, subCategories, setSubCategories }}>
            {children}
        </CategoriesContext.Provider>
    )
}

export const useCategoryTree = () => {
    const { categoryTree } = useContext(CategoriesContext);
    return categoryTree;
}

export const useSubCategories = () => {
    const { categoryTree, subCategories, setSubCategories } = useContext(CategoriesContext);
    return { categoryTree, subCategories, setSubCategories };
}

// Export as default to be used in testing
export default CategoriesContext;
