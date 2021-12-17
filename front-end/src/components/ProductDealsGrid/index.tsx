import { useContext, useEffect, useRef, useCallback } from "react";
import { GlobalStateContext } from "@contexts/globalStateContext";
import ProductDealCard from "@components/ProductDealCard";
import { useTranslation } from "@translations";

import "./styles.scss";

const ProductDealsGrid: ProductDealsGridComponent = ({
  products,
  deal_type,
}) => {
  const translate = useTranslation();
  const { dealTypeName } = useContext(GlobalStateContext);
  const offersRef = useRef<HTMLDivElement | null>();

  const translationArrayToMap = useCallback(
    (
      translationsArray: Array<DealTypeLabelTranslation | null> = []
    ): TranslationMap => {
      const translationMap: TranslationMap = {};

      translationsArray.forEach((label) => {
        if (label) {
          translationMap[label.language] = label.label as string;
        }
      });

      return translationMap;
    },
    []
  );

  useEffect(() => {
    if (dealTypeName === "amazon_flash_offers") {
      return window.scrollTo(0, 0);
    }

    if (dealTypeName === deal_type.name && offersRef.current) {
      const currentScroll = window.pageYOffset;
      const { top } = offersRef.current.getBoundingClientRect();
      const targetScroll = currentScroll + (top - 60);

      window.scrollTo(0, targetScroll);
    }
  }, [dealTypeName, deal_type.name]);

  return (
    <div
      className="product-deals-grid"
      ref={offersRef as React.LegacyRef<HTMLDivElement>}
      data-category={deal_type.name}
    >
      <div className="product-deals-grid__heading">
        {translate(translationArrayToMap(deal_type.label || []))}
      </div>
      {products.length ? (
        <div className="product-deals-grid__items">
          {products.map((product) => (
            <ProductDealCard key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <p className="product-deals-grid__empty">No products yet.</p>
      )}
    </div>
  );
};

export default ProductDealsGrid;
