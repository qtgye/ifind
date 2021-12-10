declare type AdditionalInfoOption = 'stocks_available' | 'rating';

declare interface ProductDealCardProps extends Product {
  onClick?: (product: Partial<Product>) => void;
  additional_info?: AdditionalInfoOption
}

declare interface ProductDealCardComponent
  extends React.FunctionComponent<ProductDealCardProps> {}
