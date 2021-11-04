declare interface GlobalStateContextData {
  activeCategory?: string | number;
  setActiveCategory?: (args: any) => any;
  focusedCategory?: string | any;
  onCategoryClick?: (args: any) => any;
  focusedIndex?: number;
  spritesRendered?: boolean;
  setSpritesRendered?: (args: boolean) => any;
}
