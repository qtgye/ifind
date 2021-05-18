import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { Providers } from '@contexts';
import { UserContextProvider } from '@contexts/userContext';
import routesPages from '@config/routesPages';

import Header from '@components/Header';

import './App.scss';

function App() {
  return (
    <Router>
      <UserContextProvider>
        <Providers>
          <Header />
          <main className="main">
              <Switch>
                {routesPages.map(({ path, component, exact = false }) => (
                  <Route key={path} path={path} component={component} exact={exact} />
                ))}
              </Switch>
          </main>
        </Providers>
      </UserContextProvider>
    </Router>
  );
}

export default App;
