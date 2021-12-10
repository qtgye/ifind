declare interface ProductDealCardProps extends Product {
  onClick?: (product: Partial<Product>) => void;
}

declare interface ProductDealCardComponent
  extends React.FunctionComponent<ProductDealCardProps> {}
