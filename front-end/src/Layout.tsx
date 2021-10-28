import { Switch, Route } from "react-router-dom";

import { Providers } from "@contexts";
import routesPages, { dynamicRoutePages } from "@config/routesPages";

import Header from "@components/Header";
import Footer from "@components/Footer";
import NewsLetter from "@components/NewsLetter";

const Layout = () => (
  <Providers>
    <Header />
    <main className="main">
      <Switch>
        {routesPages
          .concat(dynamicRoutePages)
          .filter(({ component }) => component || null)
          .map(({ path, component, exact = false }) => (
            <Route
              key={path}
              path={path}
              component={component as React.ComponentType<any>}
              exact={exact}
            />
          ))}
      </Switch>
    </main>
    <NewsLetter />
    <Footer />
  </Providers>
);

export default Layout;
