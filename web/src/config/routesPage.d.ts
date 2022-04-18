declare interface NamedComponentLazy
  extends NamedComponent,
    React.LazyExoticComponent<any> {}

declare interface ComponentWithProviderLazy
  extends ComponentWithProvider,
    React.LazyExoticComponent<any> {}

declare interface DynamicRoutePage {
  component?: any;
  path: string;
  label?: string;
  withSideNav?: boolean;
  exact?: boolean;
  noUserHeart?: boolean;
  translationKey?: string;
}
