import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

import { Providers } from "@contexts";
import routesPages, { dynamicRoutePages } from "@config/routesPages";

import Header from "@components/Header";
import Footer from "@components/Footer";
import NewsLetter from "@components/NewsLetter";

import "./App.scss";

// TODO: Move these to declaration files
interface DynamicRoute {
  component?: React.FunctionComponent;
  path: string;
  exact?: boolean;
}

function App() {
  return (
    <Router>
      <Providers>
        <Header />
        <main className="main">
          <Switch>
            {routesPages
              .concat(dynamicRoutePages)
              .filter(({ component }: DynamicRoute) => component || null)
              .map(({ path, component, exact = false }: DynamicRoute) => (
                <Route
                  key={path}
                  path={path}
                  component={component}
                  exact={exact}
                />
              ))}
          </Switch>
        </main>
        <NewsLetter />
        <Footer />
      </Providers>
    </Router>
  );
}

export default App;
