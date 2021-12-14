declare interface ProductContextData {
  loading?: boolean;
  productDetail?: Product;
  getProductDetails?: (id: string|number) => any;
  incrementProductClick?: (id: string) => any;
}
