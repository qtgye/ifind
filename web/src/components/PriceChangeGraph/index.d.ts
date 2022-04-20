declare interface PriceChangeItem {
  price: number;
  date_time: string;
}

declare interface PriceChangeGraphProps {
  priceChanges?: (PriceChangeItem|null)[];
}
