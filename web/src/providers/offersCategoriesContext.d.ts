declare interface OffersCategoriesContext {
  offersCategories?: OffersCategory[];
  loading?: boolean;
}

declare interface OffersCategoriesQueryData {
  offersCategories: OffersCategory[];
}

declare interface OffersCategoriesProviderProps {
  children: ReactNode;
  offersCategories: OffersCategory[];
}

declare interface OfferCategoriesPayload {
  offersCategories: OffersCategory[];
}
