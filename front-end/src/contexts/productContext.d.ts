declare interface ProductContextData {
  productDetail?: Product;
  getProductDetails?: (id: string) => any;
  incrementProductClick?: (id: string) => any;
}
