import ProductDealItem from "./item";
import { useContext, useEffect, useRef } from "react";
import { GlobalStateContext } from '@contexts/globalStateContext';

import "./styles.scss";

const ProductDealsGrid: ProductDealsGridComponent = ({
  products,
  deal_type,
}) => {

  const { dealTypeName } = useContext(GlobalStateContext);
  const offersRef = useRef<HTMLDivElement | null>();

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
    <div className="product-deals-grid" ref={offersRef as React.LegacyRef<HTMLDivElement>} data-category={deal_type.name}>
      <div className="product-deals-grid__heading">{deal_type.label}</div>
      {products.length ? (
        <div className="product-deals-grid__items">
          {products.map((product) => (
            <ProductDealItem key={product.id} {...product} />
          ))}
        </div>
      ) : (
        <p className="product-deals-grid__empty">No products yet.</p>
      )}
    </div>
  );
};

export default ProductDealsGrid;
