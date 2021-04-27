import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';

import routes from '@config/routes';

import Header from '@components/Header';
import NewsLetter from '@components/NewsLetter';
import Footer from '@components/Footer';

import './App.scss';

function App() {
  return (
    <>
      <Router>
        <Header />
      </Router>
      <main className="main">
        <Router>
          <Switch>
            {routes.map(({ path, component }) => (
              <Route key={path} path={path} component={component} />
            ))}
          </Switch>
          <NewsLetter />
        </Router> 
        <Footer />
      </main>
    </>
  );
}

export default App;
