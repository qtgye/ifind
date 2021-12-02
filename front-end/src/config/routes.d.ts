declare interface RouteConfig {
  path: string
  componentName: string
  label?: string
  withSideNav?: boolean
  exact?: boolean
  noUserHeart?: boolean,
  translationKey?: string,
}
