import { useCallback } from "react";
import { toAdminURL } from "utilities/url";
import { trackClick } from "utilities/tracking";

const ProductURLLink = ({
  url,
  source,
  logo,
  price,
  isBase,
  basePrice,
  currency,
}: ProductURLLinkProps) => {
  const percentDifference = (100 * (price - basePrice)) / basePrice;

  const onClick = useCallback(
    ({ currentTarget }) => {
      trackClick(currentTarget, {
        category: "Product",
        action: `click` + (source ? `.${source.toLowerCase()}` : ""),
      });
    },
    [source]
  );

  return (
    <a
      href={url}
      className="product-links__link-item"
      target="_blank"
      rel="noreferrer"
      onClick={onClick}
    >
      <div className="product-links__link">
        <img
          src={toAdminURL(logo)}
          alt=""
          className="product-links__link-image"
        />
      </div>
      <span className="product-links__price">
        {currency}&nbsp;{price}
      </span>
      <span
        className={[
          "product-links__diff",
          percentDifference < 0
            ? "product-links__diff--lower"
            : "product-links__diff--higher",
        ].join(" ")}
      >
        {!isBase ? `${percentDifference.toFixed(2)}%` : ""}
      </span>
    </a>
  );
};

export default ProductURLLink;
