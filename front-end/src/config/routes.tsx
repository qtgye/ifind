import { lazy } from "react";
import { Switch, Route } from "react-router-dom";
import { pathWithLanguage } from "@utilities/route";

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
    path: pathWithLanguage("/"),
    label: "Home",
    translationKey: "home",
  },
  {
    path: pathWithLanguage("/offers"),
    label: "Offers",
    withSideNav: true,
    translationKey: "offers",
  },
  {
    path: pathWithLanguage("/productcomparison"),
    label: "Product Comparison",
    withSideNav: true,
    translationKey: "productComparison",
  },
  {
    path: pathWithLanguage("/gifts"),
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
    path: pathWithLanguage("/contact"),
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
    <Route path={pathWithLanguage("/")} component={HomePage} exact />
    <Route path={pathWithLanguage("/offers")} component={Offers} />
    <Route
      path={pathWithLanguage("/productcomparison")}
      component={ProductComparison}
    />
    <Route path={pathWithLanguage("/gifts")} component={Gifts} />
    <Route path={pathWithLanguage("/contact")} component={Contact} />
    <Route path={pathWithLanguage("/:slug")} component={BasicPage} />
  </Switch>
);

export default Routes;
