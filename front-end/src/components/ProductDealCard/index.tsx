import { useEffect, useState, useCallback } from "react";
import dealTypes from "@config/deal-types";

import PercentCircle from "@components/PercentCircle";

import './styles.scss';

const ProductDealCard: ProductDealCardComponent = ({
  title,
  image,
  deal_type,
  amazon_url,
  url_list,
  price,
  price_original,
  discount_percent,
  quantity_available_percent,
}) => {
  const [productURL, setProductURL] = useState<string>("");
  const [productPrice, setProductPrice] = useState<string | null>(null);
  const [originalPrice, setOriginalPrice] = useState<number>();
  const [discountPercent, setDiscountPercent] = useState<number>();
  const [stockPercent, setStockPercent] = useState<number>();

  const getProductDetails = useCallback(() => {
    // Use default product details if deal_type is amazon or none
    if ( !deal_type || /amazon/.test(deal_type as string)) {
      setProductURL(amazon_url || "");
      setProductPrice(String(price));
      setOriginalPrice(price_original);
      setDiscountPercent(discount_percent);
      setStockPercent(quantity_available_percent);
    } else {
      // Determine url and price according to product.deal_type
      const [dealKey, dealData] =
        Object.entries(dealTypes as DealTypeMap).find(
          ([key]) => key === deal_type
        ) || [];

      if (dealKey) {
        const matchedOtherSiteDetails = url_list?.find((otherSiteDetails) =>
          new RegExp(dealData?.site || "no-match-name", "i").test(
            otherSiteDetails?.source?.name || ""
          )
        );

        if (matchedOtherSiteDetails) {
          setProductURL(matchedOtherSiteDetails.url || "");
          setProductPrice(String(matchedOtherSiteDetails.price));
          setOriginalPrice(matchedOtherSiteDetails.price_original);
          setDiscountPercent(matchedOtherSiteDetails.discount_percent);
          setStockPercent(matchedOtherSiteDetails.quantity_available_percent);
        }
      }
    }
  }, [
    deal_type,
    amazon_url,
    url_list,
    price,
    price_original,
    discount_percent,
    quantity_available_percent,
  ]);

  useEffect(() => {
    getProductDetails();
  }, [deal_type]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <a className="product-deal-card" href={productURL} target="_blank" rel="noreferrer">
      <div className="product-deal-card__content">
        {discountPercent ? (
          <div className="product-deal-card__discount">{`-${discountPercent}%`}</div>
        ) : (
          ""
        )}
        <div className="product-deal-card__image">
          <img src={image} alt="" />
        </div>
        <div className="product-deal-card__details">
          <div className="product-deal-card__title">{title}</div>
          <div className="product-deal-card__deal-info">
            <div className="product-deal-card__price">
              {originalPrice ? (
                <small className="product-deal-card__price-original">
                  {" "}
                  €{originalPrice}{" "}
                </small>
              ) : (
                ""
              )}
              <strong className="product-deal-card__price-discounted">
                €{productPrice}
              </strong>
            </div>
            <PercentCircle percent={stockPercent === null ? null : stockPercent || null} />
          </div>
        </div>
      </div>
    </a>
  );
};

export default ProductDealCard;
