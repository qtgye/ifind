import { useRouter } from "next/router";
import React, { createContext, useContext, useEffect, useState } from "react";
import gqlFetch from "utilities/gqlFetch";
import { useProductsByDeals } from "./productsByDealsContext";

export const OffersCategoriesContext = createContext<OffersCategoriesContext>(
  {}
);

export const OffersCategoriesProvider = ({
  children,
  offersCategories = [],
}: OffersCategoriesProviderProps) => {
  const {
    query: { offer_id },
  } = useRouter();
  const [activeOffer, setActiveOffer] = useState<OffersCategory>();

  useEffect(() => {
    const currentOffer =
      (offer_id ? offersCategories.find(({ id }) => offer_id === id) : null) ||
      offersCategories.find(({ isDefault }) => isDefault);

    if (currentOffer) {
      setActiveOffer(currentOffer);
    }
  }, [offersCategories, offer_id]);

  return (
    <OffersCategoriesContext.Provider value={{ offersCategories, activeOffer }}>
      {children}
    </OffersCategoriesContext.Provider>
  );
};

export const useOffersCategories = () => useContext(OffersCategoriesContext);

export const getOffersCategories = async () =>
  gqlFetch<OfferCategoriesPayload>(`
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
