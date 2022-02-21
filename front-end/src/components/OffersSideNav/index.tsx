import { useState, useEffect, useCallback } from "react";
import withConditionalRender from "@utilities/hocs/withConditionalRender";
import { useTranslation } from "@translations/index";
import {
  useProductsByDeals,
  ProductsByDealsContextProvider,
} from "@contexts/productsByDealsContext";
import RenderIf from "@components/RenderIf";
import IfindIcon from "@components/IfindIcon";

import "./styles.scss";

const OffersSideNav = ({
  activeDealTypeName,
  onDealClick,
}: OffersSideNavProps) => {
  const translate = useTranslation();
  const productsByDeals = useProductsByDeals();
  const [dealTypes, setDealTypes] = useState<DealType[]>([]);

  const extractNavLabel = useCallback(
    (dealType: DealType) => {
      const translatedLabelMap = dealType?.nav_label?.reduce(
        (labelMap: TranslationMap, navLabelTranslation) => {
          const code = navLabelTranslation?.language || "";
          labelMap[code] = navLabelTranslation?.label || "";
          return labelMap;
        },
        {}
      );

      console.log({ translatedLabelMap });

      return translate(translatedLabelMap);
    },
    [translate]
  );

  useEffect(() => {
    if (productsByDeals.productsByDeals?.length) {
      setDealTypes(
        productsByDeals.productsByDeals.map(({ deal_type }) => deal_type)
      );
    }
  }, [productsByDeals]);

  return (
    <div className="offers-sidenav">
      {dealTypes.map((item) => {
        return (
          <div
            key={item.name}
            className={[
              "list",
              item.name === activeDealTypeName ? "active" : "",
            ].join(" ")}
          >
            <button onClick={() => onDealClick(item.name || "")}>
              <span className="offers-icon">
                <RenderIf condition={item.nav_icon?.type === "fontawesome"}>
                  <i
                    className={`fa fa-${item.nav_icon?.icon}`}
                    aria-hidden="true"
                  ></i>
                </RenderIf>
                <RenderIf condition={item.nav_icon?.type === "ifind"}>
                  <IfindIcon icon={item.nav_icon?.icon || ""} />
                </RenderIf>
              </span>
              <span className="offers-label">{extractNavLabel(item)}</span>
            </button>
          </div>
        );
      })}
    </div>
  );
};

const OffersSideNavWrapped = (props: OffersSideNavProps) => (
  <ProductsByDealsContextProvider>
    <OffersSideNav {...props} />
  </ProductsByDealsContextProvider>
);

export default withConditionalRender<OffersSideNavProps>(OffersSideNavWrapped);
