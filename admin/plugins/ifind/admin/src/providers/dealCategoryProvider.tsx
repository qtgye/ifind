import React, {
  useState,
  useEffect,
  useCallback,
  useContext,
  createContext,
  PropsWithChildren,
  ReactNode,
} from "react";
import { get } from "../helpers/scripts-server/request";

declare interface DealCategoryLabel {
  language: "en" | "de";
  label: string;
}

declare interface DealCategory {
  id?: string;
  isDefault?: boolean;
  label: Array<DealCategoryLabel>;
}

declare interface I_DealCategoryContext {
  dealCategories: Array<DealCategory>;
}

export const DealCategoryContext = createContext<I_DealCategoryContext>({
  dealCategories: [],
});

export const DealCategoryProvider = ({
  children,
}: PropsWithChildren<ReactNode>) => {
  const [dealCategories, setDealCategories] = useState<DealCategory[]>([]);

  useEffect(() => {
    get("/dealCategory")
      .then(({ data }: { data: { [key: string]: DealCategory } }) => {
        return Object.entries(data).reduce(
          (dealCategories: DealCategory[], [id, data]) => {
            dealCategories.push({
              id,
              ...data,
            });

            return dealCategories;
          },
          []
        );
      })
      .then((dealCategories) => {
        setDealCategories(dealCategories);
      });
  }, []);

  return (
    <DealCategoryContext.Provider value={{ dealCategories }}>
      {children}
    </DealCategoryContext.Provider>
  );
};

export const useDealCategory = () => useContext(DealCategoryContext);
