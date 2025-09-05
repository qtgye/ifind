import { useEffect, useRef, useCallback, useState, MouseEvent } from "react";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { dateTime } from "ifind-utils";
import { useGlobalState } from "providers/globalStateContext";
import ProductDealCard from "components/ProductDealCard";
import { useTranslation } from "translations/index";
import RenderIf from "components/RenderIf";

import { updatedTime, loadMoreButton } from "./translations";

const INITIAL_PRODUCTS_IN_VIEW = 20;
const PRODUCTS_PER_LOAD = 12;

dayjs.extend(utc);

const ProductDealsGrid: ProductDealsGridComponent = ({
  products,
  deal_type,
}) => {
  const now = Date.now();
  const translate = useTranslation();
  const { dealTypeName } = useGlobalState();
  const offersRef = useRef<HTMLDivElement | null>();
  const [visibleProductsAmount, setVisibleProductsAmount] = useState(
    INITIAL_PRODUCTS_IN_VIEW
  );
  const [productsList, setProductsList] = useState(
    products.filter(({ deal_expiry }) =>
      deal_expiry ? deal_expiry > now : true
    )
  );
  const [totalProducts, setTotalProducts] = useState(productsList.length);
  const [productsInView, setProductsInView] = useState<Product[]>(
    productsList.slice(0, visibleProductsAmount)
  );

  const [lastUpdated, setLastUpdated] = useState(0);

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

  const onLoadMoreClick = useCallback(
    (e: MouseEvent) => {
      e.preventDefault();
      setVisibleProductsAmount(visibleProductsAmount + PRODUCTS_PER_LOAD);
    },
    [visibleProductsAmount]
  );

  const onProductDealExpire = useCallback(
    (productID: string) => {
      const filteredProducts = productsList.filter(
        ({ id }) => productID !== id
      );

      setProductsList(filteredProducts);
      setTotalProducts(filteredProducts.length);
    },
    [productsList]
  );

  useEffect(() => {
    setProductsInView(productsList.slice(0, visibleProductsAmount));
  }, [visibleProductsAmount, productsList]);

  useEffect(() => {
    const [mostRecentProduct] = productsList
      .slice()
      .sort((productA, productB) =>
        productA.created_at > productB.created_at ? -1 : 1
      );

    if (mostRecentProduct) {
      setLastUpdated(dayjs.utc(mostRecentProduct.created_at).valueOf());
    }
  }, [productsList]);

  useEffect(() => {
    if (dealTypeName === "amazon_flash_offers") {
      return window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }

    if (dealTypeName === deal_type.name && offersRef.current) {
      const currentScroll = window.pageYOffset;
      const { top } = offersRef.current.getBoundingClientRect();
      const targetScroll = currentScroll + (top - 60);

      window.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
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
        <RenderIf condition={lastUpdated ? true : false}>
          <aside className="product-deals-grid__update-time">
            {translate(updatedTime, {
              TIME: dateTime.formatGranularTime(
                dayjs.utc().valueOf() - Number(lastUpdated),
                true,
                true
              ),
            })}
          </aside>
        </RenderIf>
      </div>
      {productsList.length ? (
        <div className="product-deals-grid__items">
          {productsInView.map((product) => (
            <ProductDealCard
              key={product.id}
              {...product}
              onDealExpire={onProductDealExpire}
            />
          ))}
        </div>
      ) : (
        <p className="product-deals-grid__empty">No products yet.</p>
      )}
      <RenderIf condition={productsInView.length < totalProducts}>
        <div className="product-deals-grid__load-more">
          <button
            className="product-deals-grid__load-more-button"
            onClick={onLoadMoreClick}
          >
            {translate(loadMoreButton)}
          </button>
        </div>
      </RenderIf>
    </div>
  );
};

export default ProductDealsGrid;
