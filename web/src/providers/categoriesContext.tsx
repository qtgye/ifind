import React, { createContext, useEffect, useContext, useState } from "react";
// import { useQuery } from "@apollo/react-hooks";
// import getCategoryTree from "@gql/getCategoryTreeQuery";
import { useLanguages } from "./languagesContext";

export const CategoriesContext = createContext<CategoriesContextData>({});

export const CategoriesContextProvider = ({
  children,
}: React.PropsWithChildren<React.ReactNode>) => {
  const { userLanguage } = useLanguages();
  const [categoryTree, setCategoryTree] = useState<
    (CategoryWithChild | null)[]
  >([]);
  const [subCategories, setSubCategories] = useState<
    (CategoryWithChild | null)[]
  >([]);

  const data = {};

  useEffect(() => {
    if (data?.categoryTree) {
      setCategoryTree([...data.categoryTree]);
    }
  }, [data]);

  useEffect(() => {
    if (Array.isArray(categoryTree)) {
      setSubCategories(categoryTree[0]?.children || []);
    }
  }, [categoryTree]);

  // useEffect(() => {
  //   setCategoryTree([]);
  //   refetch();
  // }, [ userLanguage, refetch ]);

  return (
    <CategoriesContext.Provider
      value={{ categoryTree, subCategories, setSubCategories }}
    >
      {children}
    </CategoriesContext.Provider>
  );
};

export const useCategoryTree = () => {
  const { categoryTree } = useContext(CategoriesContext);
  return categoryTree;
};

export const useSubCategories = () => {
  const { categoryTree, subCategories, setSubCategories } = useContext(
    CategoriesContext
  );
  return { categoryTree, subCategories, setSubCategories };
};

// Export as default to be used in testing
export default CategoriesContext;
