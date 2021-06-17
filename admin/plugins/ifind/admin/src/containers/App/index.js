/**
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */
import React, { useEffect } from 'react';
import { Switch, Route, useHistory } from 'react-router-dom';
import { BackHeader, NotFound } from 'strapi-helper-plugin';
// Utils
import pluginId from '../../pluginId';
// Containers
import Categories from '../Categories';
import ProductsListing from '../ProductsListing';
import ProductDetail from '../ProductDetail';

// Providers
import Providers from '../../providers';
import { ProductProvider } from '../../providers/productProvider';

import { spriteContents } from 'ifind-icons';

import './styles.scss';

const App = () => {
  const { goBack } = useHistory();

  return (
    <div className="ifind-plugin">
      <div hidden dangerouslySetInnerHTML={{ __html: spriteContents }}></div>
        <BackHeader onClick={goBack} />
        <Providers>
          <Switch>
            <Route path={`/plugins/${pluginId}/categories`} component={Categories} exact />
            <Route path={`/plugins/${pluginId}/products`} component={ProductsListing} exact />
            <Route path={`/plugins/${pluginId}/products/create`} component={ProductDetail} exact />
            <Route path={`/plugins/${pluginId}/products/:productId`} component={ProductDetail} />
            <Route component={NotFound} />
          </Switch>
        </Providers>
    </div>
  )
};

export default App;
