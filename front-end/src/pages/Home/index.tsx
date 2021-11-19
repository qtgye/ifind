//import { useEffect, useRef } from "react";

import {
  useProductsByDeals,
  ProductsByDealsContextProvider,
} from "@contexts/productsByDealsContext";
import GeneralTemplate from "@templates/GeneralTemplate";
import ProductDealsGrid from "@components/ProductDealsGrid";
import React from "react";
import "./home.scss";
import ProgressBars from "@components/ProgressBar";

const Home: React.FunctionComponent = () => {
  const { loading = false, productsByDeals } = useProductsByDeals();
  const icon = "/images/loading.png";

  return (
    <GeneralTemplate>
      <div className="home">
        <div className="container">
          {loading && (
            <span className="loading">
              <img src={icon} className="loading-icon" alt="icon" />
            </span>
          )}
          {loading && (
            <div className="progress">
              <ProgressBars />
            </div>
          )}
          {!loading &&
            (productsByDeals || []).map((productsByDeal) => (
              <ProductDealsGrid
                key={productsByDeal.deal_type.name}
                {...productsByDeal}
              />
            ))}
        </div>
      </div>
    </GeneralTemplate>
  );
};

const HomePageWrapped: NamedComponent = ({ children }) => (
  <ProductsByDealsContextProvider>
    <Home>{children}</Home>
  </ProductsByDealsContextProvider>
);

HomePageWrapped.componentName = "HomePage";

export default HomePageWrapped;
