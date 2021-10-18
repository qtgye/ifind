declare interface CarouselProps {
  categories: Category[];
  currentCategory?: string | number;
  onCategoryLoadClick?: (
    event: React.SyntheticEvent<MouseEvent>,
    callback: (args: any) => any
  ) => any;
  onCategoryNavClick?: (args: any) => any;
}
