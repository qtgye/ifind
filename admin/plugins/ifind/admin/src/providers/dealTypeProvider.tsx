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

declare interface DealTypeNavLabel {
  language: string;
  label: string;
}

declare interface DealTypeLabel {
  language: string;
  label: string;
}

declare interface DealTypeConfig {
  site: string;
  nav_label: DealTypeNavLabel[];
  nav_icon: {
    type: "ifind" | "fontawesome";
    icon: string;
  };
  label: DealTypeLabel[];
  deal_category: string;
}

declare interface DealType extends DealTypeConfig {
  id: string;
}

declare interface I_DealTypeContext {
  dealTypes: Array<DealType>;
}

export const DealTypeContext = createContext<I_DealTypeContext>({
  dealTypes: [],
});

export const DealTypeProvider = ({
  children,
}: PropsWithChildren<ReactNode>) => {
  const [dealTypes, setDealTypes] = useState<DealType[]>([]);

  useEffect(() => {
    get("/dealType")
      .then(({ data }: { data: { [key: string]: DealTypeConfig } }) => {
        return Object.entries(data).reduce(
          (dealTypes: DealType[], [id, data]) => {
            dealTypes.push({
              id,
              ...data,
            });

            return dealTypes;
          },
          []
        );
      })
      .then((dealTypes) => setDealTypes(dealTypes));
  }, []);

  return (
    <DealTypeContext.Provider value={{ dealTypes }}>
      {children}
    </DealTypeContext.Provider>
  );
};

export const useDealType = () => useContext(DealTypeContext);
