import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import { Providers } from '@contexts';
import routes from '@config/routes';

import Header from '@components/Header';
import NewsLetter from '@components/NewsLetter';
import Footer from '@components/Footer';

import './App.scss';

function App() {
  return (
    <Router>
      <Providers>
        <Header />
        <main className="main">
            <Switch>
              {routes.map(({ path, component, exact = false }) => (
                <Route key={path} path={path} component={component} exact={exact} />
              ))}
            </Switch>
            <NewsLetter />
          <Footer />
        </main>
      </Providers>
    </Router>
  );
}

export default App;
