//import { useEffect, useRef } from "react";

import {
  useProductsByDeals,
  ProductsByDealsContextProvider,
} from "@contexts/productsByDealsContext";
import GeneralTemplate from "@templates/GeneralTemplate";
import ProductDealsGrid from "@components/ProductDealsGrid";
import React from "react";
import "./offers.scss";
import ProgressBars from "@components/ProgressBar";

const Offers: React.FunctionComponent = () => {
  const { loading = false, productsByDeals } = useProductsByDeals();
  const icon = '/images/loading.png';

  return (
    <GeneralTemplate>
      <div className="offers">
        <div className="container">
          {loading &&
            <span className="loading"><img src={icon} className="loading-icon" alt="icon" /></span>
          }
          {loading && (
            <div className="progress">
              <ProgressBars />
            </div>
          )}
          {!loading && (productsByDeals || []).map((productsByDeal => (
            <ProductDealsGrid key={productsByDeal.deal_type.name} {...productsByDeal} />
          )))}
        </div>
      </div>
    </GeneralTemplate>
  );
};

const OffersPageWrapped: NamedComponent = ({ children }) => (
  <ProductsByDealsContextProvider>
    <Offers>{children}</Offers>
  </ProductsByDealsContextProvider>
);

OffersPageWrapped.componentName = 'OffersPage';

export default OffersPageWrapped;
