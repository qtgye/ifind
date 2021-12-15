import { useRouteMatch, useLocation } from "react-router";
import { routesExtraConfig } from "@config/routes";

export const pathWithLanguage = (path: string) => `/:language${path}`;

export const useCurrentRouteMatch = () => {
  const { pathname } = useLocation();
  const match = useRouteMatch({
    path: pathname.replace(/\/[^/]+/, '/:language')
  });
  return match;
}

export const useCurrentRouteConfig = () => {
  const match = useCurrentRouteMatch();
  const matchedRouteConfig = routesExtraConfig.find(({ path }: RouteConfig) => path === match?.path);
  console.log({ match, matchedRouteConfig });
  return matchedRouteConfig || null;
}
