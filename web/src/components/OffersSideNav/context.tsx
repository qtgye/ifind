import { useOffersCategories } from "providers/offersCategoriesContext";
import { useProductsByDeals } from "providers/productsByDealsContext";
import {
  createContext,
  PropsWithChildren,
  ReactNode,
  useContext,
  useState,
} from "react";

export const OffersSideNavContext = createContext<OfferSideNavContext>({});

export const OffersSideNavProvider = ({ children }: OffersSideNavProps) => {
  const { activeOffer, offersCategories } = useOffersCategories();
  const { productsByDeals = [] } = useProductsByDeals();
  const items: OffersSideNavItem[] = activeOffer
    ? productsByDeals
        ?.filter(({ deal_type }) =>
          activeOffer.dealTypes?.includes(deal_type.name || "")
        )
        ?.map(({ deal_type }) => deal_type)
    : [];

  return (
    <OffersSideNavContext.Provider value={{ items }}>
      {children}
    </OffersSideNavContext.Provider>
  );
};

export const useOffersSideNav = () => useContext(OffersSideNavContext);
