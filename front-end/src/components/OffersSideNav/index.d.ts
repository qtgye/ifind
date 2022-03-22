declare interface OffersSideNavItem extends DealType {}

declare interface OfferSideNavContext {
  items?: OffersSideNavItem[];
  setItems?: (dealTypes: OffersSideNavItem[]) => void;
}

declare interface OffersSideNavProps {
  activeDealTypeName: string | null;
  onDealClick: (dealTypeName: string) => void;
}
