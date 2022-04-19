declare interface ProductChangeWithStateObject extends ProductChange {
  state?: Product;
}

declare interface ProductDetailsProps {
  product?: Product;
  isLoading?: boolean;
}
