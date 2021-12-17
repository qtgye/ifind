import { lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { routeWithLanguage } from "@utilities/route";

const HomePage = lazy(() => import("@pages/Home") as Promise<any>);
const Offers = lazy(() => import("@pages/Offers") as Promise<any>);
const ProductComparison = lazy(
  () => import("@pages/ProductComparison") as Promise<any>
);
const Gifts = lazy(() => import("@pages/Gifts") as Promise<any>);
const BasicPage = lazy(() => import("@pages/BasicPage") as Promise<any>);
const Contact = lazy(() => import("@pages/Contact") as Promise<any>);

export const routesExtraConfig: RouteConfig[] = [
  /**
   * Routes visible in Header Navigation
   */
  {
    path: routeWithLanguage("/"),
    label: "Home",
    translationKey: "home",
  },
  {
    path: routeWithLanguage("/offers"),
    label: "Offers",
    withSideNav: true,
    translationKey: "offers",
  },
  {
    path: routeWithLanguage("/productcomparison"),
    label: "Product Comparison",
    withSideNav: true,
    translationKey: "productComparison",
  },
  {
    path: routeWithLanguage("/gifts"),
    label: "Gifts",
    translationKey: "gifts",
  },
  // {
  //     path: '/findtube',
  //     label: 'Findtube',
  // },
  // {
  //     path: '/blog',
  //     label: 'Blog',
  // },
  {
    path: routeWithLanguage("/contact"),
    label: "Contact",
    translationKey: "contact",
  },
];

export const navigationRoutes: NavigationRoute[] = [
  {
    path: "/",
    translationKey: "home",
  },
  {
    path: "/offers",
    translationKey: "offers",
    label: "Offers",
  },
  {
    path: "/productcomparison",
    translationKey: "productComparison",
  },
  {
    path: "/gifts",
    translationKey: "gifts",
  },
  {
    path: "/contact",
    translationKey: "contact",
  },
];

/**
 * Dynamic Routes
 */
export const dynamicRoutes: RouteConfig[] = [
  {
    path: "/:slug",
  },
];

const Routes = () => (
  <Switch>
    <Route path={routeWithLanguage("/")} component={HomePage} exact />
    <Route path={routeWithLanguage("/offers")} component={Offers} />
    <Route
      path={routeWithLanguage("/productcomparison")}
      component={ProductComparison}
    />
    <Route path={routeWithLanguage("/gifts")} component={Gifts} />
    <Route path={routeWithLanguage("/contact")} component={Contact} />
    <Route path={routeWithLanguage("/:slug")} component={BasicPage} />
  </Switch>
);

export default Routes;
