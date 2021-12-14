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

declare interface ProductLinksProps {
  product?: Product;
}
