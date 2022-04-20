import React, { createContext, useState, useContext, useEffect } from "react";
import { useQuery } from "@apollo/client";
import offersCategoriesQuery from "@gql/offersCategoriesQuery";

export const OffersCategoriesContext = createContext<OffersCategoriesContext>(
  {}
);

export const OffersCategoriesProvider = ({
  children,
}: React.PropsWithChildren<any>) => {
  const { data, loading } = useQuery<OffersCategoriesQueryData>(
    offersCategoriesQuery
  );
  const [offersCategories, setOffersCategories] = useState<OffersCategory[]>(
    []
  );

  useEffect(() => {
    if (data?.offersCategories) {
      setOffersCategories(data.offersCategories);
    }
  }, [data]);

  return (
    <OffersCategoriesContext.Provider value={{ offersCategories, loading }}>
      {children}
    </OffersCategoriesContext.Provider>
  );
};

export const useOffersCategories = () => useContext(OffersCategoriesContext);
