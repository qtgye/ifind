declare interface ProductsByDealsContextProviderProps {
  children?: JSX.Element;
  productsByDeals: ProductsByDeal[];
}

declare interface ProductsByDeal {
  deal_type: DealType;
  products: Product[];
}

declare interface ProductsByDealsValues {
  loading?: boolean;
  error?: ApolloError;
  productsByDeals?: ProductsByDeal[];
}

declare interface DealTypeMap {
  [dealKey: string]: DealType;
}

declare interface ProductsByDealsPayload {
  productsByDeals: ProductsByDeal[]
}
