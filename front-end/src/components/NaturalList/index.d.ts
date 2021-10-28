declare interface NaturalListProps {
  items: (Product|null)[];
  loading?: boolean;
  category?: ProductCategory;
  observeItem?: (args: any) => any;
  id?: string;
  label?: string;
  date?: string;
}

declare interface NaturalListItemProps {
  active?: boolean;
  image?: string;
  title?: string;
  price?: number;
  withBadge?: boolean;
  onClick?: (args: any) => any;
}

declare interface NaturalListModalProps {
  open?: boolean;
  close?: () => void;
  children?: React.ReactNode;
}
