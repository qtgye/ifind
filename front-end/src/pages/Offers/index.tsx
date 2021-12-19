//import { useEffect, useRef } from "react";

import {
  useProductsByDeals,
  ProductsByDealsContextProvider,
} from "@contexts/productsByDealsContext";
import GeneralTemplate from "@templates/GeneralTemplate";
import ProductDealsGrid from "@components/ProductDealsGrid";
import React, { PropsWithChildren } from "react";
import "./offers.scss";
import ProgressBars from "@components/ProgressBar";
import RenderIf from "@components/RenderIf";

const Offers: React.FunctionComponent = () => {
  const { loading = false, productsByDeals } = useProductsByDeals();
  const icon = "/images/loading.png";

  return (
    <GeneralTemplate>
      <div className="offers">
        <div className="offers__container">
          <RenderIf condition={loading}>
            <span className="loading">
              <img src={icon} className="loading-icon" alt="icon" />
            </span>
            <div className="progress">
              <ProgressBars />
            </div>
          </RenderIf>
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

const OffersPageWrapped = ({
  children,
}: PropsWithChildren<React.ReactNode>) => (
  <ProductsByDealsContextProvider>
    <Offers>{children}</Offers>
  </ProductsByDealsContextProvider>
);

export default OffersPageWrapped;
