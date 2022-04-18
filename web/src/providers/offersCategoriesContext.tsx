import React, { createContext, useContext } from "react";
import gqlFetch from "utilities/gqlFetch";

export const OffersCategoriesContext = createContext<OffersCategoriesContext>(
  {}
);

export const OffersCategoriesProvider = ({
  children,
  offersCategories = [],
}: OffersCategoriesProviderProps) => {
  return (
    <OffersCategoriesContext.Provider value={{ offersCategories }}>
      {children}
    </OffersCategoriesContext.Provider>
  );
};

export const useOffersCategories = () => useContext(OffersCategoriesContext);

export const getOffersCategories = async () =>
  gqlFetch(`
    query OffersCategoriesQuery {
      offersCategories {
        id
        label {
          label
          language
        }
        isDefault
        dealTypes
      }
    }
`);
