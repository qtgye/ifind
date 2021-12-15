import React, { lazy, Suspense } from "react";
import { PageContextProvider } from "@contexts/pageContext";
import { ProductComparisonContextProvider } from "@contexts/productComparisonContext";
import { dynamicRoutes } from "./routes";

const Home = lazy(() => import("@pages/Home") as Promise<any>);
const Offers = lazy(() => import("@pages/Offers") as Promise<any>);
const ProductComparison = lazy(
  () => import("@pages/ProductComparison") as Promise<any>
);
const Findtube = lazy(() => import("@pages/Findtube") as Promise<any>);
const Gifts = lazy(() => import("@pages/Gifts") as Promise<any>);
const Blog = lazy(() => import("@pages/Blog") as Promise<any>);
const Contact = lazy(() => import("@pages/Contact") as Promise<any>);
const AGB = lazy(() => import("@pages/AGB") as Promise<any>);
const Impressum = lazy(() => import("@pages/Impressum") as Promise<any>);
const DataProtection = lazy(
  () => import("@pages/DataProtection") as Promise<any>
);
const AboutUs = lazy(() => import("@pages/AboutUs") as Promise<any>);

/**
 * Dynamic route pages
 */
const BasicPage = lazy(() => import("@pages/BasicPage") as Promise<any>);

export const pages = [
  Home,
  Offers,
  ProductComparison,
  Gifts,
  Findtube,
  Blog,
  Contact,
  AGB,
  Impressum,
  DataProtection,
  AboutUs,
];

export const dynamicPages: (ComponentWithProviderLazy | null)[] = [BasicPage];

const providers = [PageContextProvider, ProductComparisonContextProvider];

const wrapWithProvider = (PageComponent?: ComponentWithProvider) => {
  if (PageComponent?.provider) {
    const MatchedProvider = providers.find(
      (provider) => provider.providerName === PageComponent.provider
    );
    if (MatchedProvider) {
      return (props: any) => (
        <MatchedProvider>
          <Suspense fallback={<div>Loading...</div>}>
            <PageComponent {...props} />
          </Suspense>
        </MatchedProvider>
      );
    }
  }
  return PageComponent
    ? (props: any) => (
        <Suspense fallback={<div>Loading...</div>}>
          <PageComponent {...props} />
        </Suspense>
      )
    : null;
};

export const dynamicRoutePages = dynamicRoutes;
