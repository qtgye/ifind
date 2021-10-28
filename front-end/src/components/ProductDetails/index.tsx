import { useState, useEffect } from "react";
import ReactShadowRoot from "react-shadow-root";
import { v4 as uuid } from "uuid";

import { useSourceRegion } from "@contexts/sourceRegionContext";
import PriceChangeGraph from "@components/PriceChangeGraph";
import ProductRating from "@components/ProductRating";
import ProductURLLink from "./product-url-link";

import inlineStyles from "./detail-styles";
import "./product-details.scss";

const icon = "/images/loading.png";

const ProductDetails = ({ product, isLoading }: ProductDetailsProps) => {
  const { sources } = useSourceRegion();
  const amazonSource = sources?.find((source) => /amazon/i.test(source.name));
  const [urlItems, setURLItems] = useState<URLListItemWithKey[]>([]);
  const productChanges =
    product?.product_changes?.map((productChange) => {
      return {
        ...productChange,
        state: JSON.parse(productChange?.state || "{}"),
      } as ProductChangeWithStateObject;
    }) || [];

  useEffect(() => {
    // Add keys to urlList
    if (product?.url_list) {
      const urlItems = product.url_list?.map((urlData) => ({
        ...urlData,
        key: uuid(),
      }));
      setURLItems(urlItems as URLListItemWithKey[]);
    }
  }, [product]);

  return (
    <div className="product-details">
      {isLoading && (
        <span className="loading">
          <img src={icon} className="loading-icon" alt="icon" />
        </span>
      )}
      {!isLoading && product && (
        <div className="product-details__content">
          <h1 className="product-details__title">{product.title}</h1>
          <div className="product-details__body">
            <ReactShadowRoot>
              <style>{inlineStyles}</style>
              <div
                dangerouslySetInnerHTML={{ __html: product.details_html || "" }}
              ></div>
            </ReactShadowRoot>
          </div>
          <div className="product-details__additional">
            <div className="product-details__links">
              <ProductURLLink
                key={product.amazon_url}
                url={product.amazon_url}
                logo={amazonSource?.button_logo?.url}
                price={product.price || 0}
                isBase={true}
                basePrice={product.price || 1}
                currency={product.region?.currency?.symbol}
              />
              {urlItems.map(({ key, url, source, price, region, is_base }) => (
                <ProductURLLink
                  key={key}
                  url={url}
                  source={source?.name}
                  logo={source?.button_logo?.url}
                  price={price || 0}
                  basePrice={product.price || 1}
                  currency={product.region?.currency?.symbol}
                />
              ))}
            </div>
            {product?.product_changes?.length ? (
              <PriceChangeGraph
                priceChanges={productChanges.map(
                  (productChange) =>
                    productChange && {
                      price: productChange?.state?.price || 0,
                      date_time: productChange.date_time,
                    }
                )}
              />
            ) : null}
            {product.final_rating ? (
              <ProductRating
                finalRating={product.final_rating}
                attributes={product.attrs_rating || []}
              />
            ) : null}
          </div>
        </div>
      )}
      {!isLoading && !product && (
        <strong>No data available for this product</strong>
      )}
    </div>
  );
};

export default ProductDetails;
