import { useRouteMatch, useLocation } from "react-router";
import { routesExtraConfig } from "@config/routes";
import { useLanguages } from "@contexts/languagesContext";

export const routeWithLanguage = (path: string) => `/:language${path}`;

export const useCurrentRouteMatch = () => {
  const { pathname } = useLocation();
  const match = useRouteMatch({
    path: pathname.replace(/\/[^/]+/, "/:language"),
  });
  return match;
};

export const useCurrentRouteConfig = () => {
  const match = useCurrentRouteMatch();
  const matchedRouteConfig = routesExtraConfig.find(
    ({ path }: RouteConfig) => path === match?.path?.replace(/\/$/, "")
  );
  return matchedRouteConfig || null;
};

export const useLinkWithLanguage = () => {
  const { userLanguage } = useLanguages();
  return (absoluteLink: string = "/") => `/${userLanguage}${absoluteLink}`;
};

export const useIsRouteMatch = () => {
  const currentRouteMatch = useCurrentRouteMatch();

  return (route: string = "/", omitLanguage: boolean = false): boolean =>
    currentRouteMatch?.path.replace(/\/$/, '') ===
    (omitLanguage ? route.replace(/\/$/, '') : routeWithLanguage(route).replace(/\/$/, ''));
};
