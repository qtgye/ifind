declare interface CategorySelectProps {
  exclude?: string[];
  category?: string;
  onChange: (categoryId: string, categoryPath: string[]) => void;
  hasError?: boolean;
  emptyMessage?: string;
  allowParent?: boolean;
}