declare interface ProductDetailsProps {
  product?: Product;
  isLoading?: boolean;
}

declare interface URLListItemWithKey extends ComponentAtomsUrlWithType {
  key: string;
  id: string;
}

declare interface ProductURLLinkProps {
  url?: string;
  source?: string;
  logo?: string;
  price: number;
  isBase?: boolean;
  basePrice: number;
  currency?: string;
}

declare interface ProductChangeWithStateObject extends ProductChange {
  state?: Product;
}
