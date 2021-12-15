declare interface RouteConfig {
  path: string;
  label?: string;
  withSideNav?: boolean;
  exact?: boolean;
  noUserHeart?: boolean;
  translationKey?: string;
}

declare interface NavigationRoute {
  path: string;
  label: string;
  translationKey: string;
  label?: string;
}
