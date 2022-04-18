declare interface OffersRouteParams {
  offer_id?: string;
}

declare interface RouteConfig {
  id?: string;
  path: string;
  label?: string;
  withSideNav?: boolean;
  exact?: boolean;
  noUserHeart?: boolean;
  translationKey?: string;
  pattern?: RegExp;
}

declare interface NavigationRoute {
  path: string;
  label: string;
  translationKey: string;
  label?: string;
}
