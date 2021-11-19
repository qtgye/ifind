import { Switch, Route, Redirect } from "react-router-dom";

import { Providers } from "@contexts";
import routesPages, { dynamicRoutePages } from "@config/routesPages";
import { locale } from "@config/locale";

import Header from "@components/Header";
import Footer from "@components/Footer";
import NewsLetter from "@components/NewsLetter";

const Layout = () => (
  <Switch>
    <Route path="/" exact render={() => <Redirect to={`/${locale}`} />} />
    <Route path="/:language">
      <Providers>
        <Header />
        <main className="main">
          <Switch>
            {routesPages
              .concat(dynamicRoutePages)
              .filter(({ component }) => component || null)
              .map(({ path, component, exact = false }) => {
                return (
                  <Route
                    key={path}
                    path={`/:language${path}`}
                    component={component as React.ComponentType<any>}
                    exact={exact}
                  />
                );
              })}
          </Switch>
        </main>
        <NewsLetter />
        <Footer />
      </Providers>
    </Route>
  </Switch>
);

export default Layout;
