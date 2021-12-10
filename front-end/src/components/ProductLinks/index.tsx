import { useState, useEffect } from "react";
import { v4 as uuid } from "uuid";
import { useSourceRegion } from "@contexts/sourceRegionContext";

import ProductURLLink from "./product-url-link";

import "./styles.scss";

const ProductLinks = ({ product }: ProductLinksProps) => {
  const { sources } = useSourceRegion();
  const [urlItems, setURLItems] = useState<URLListItemWithKey[]>([]);
  const amazonSource = sources?.find((source) => /amazon/i.test(source.name));

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
    <div className="product-links">
      <ProductURLLink
        key={product?.amazon_url}
        url={product?.amazon_url}
        logo={amazonSource?.button_logo?.url}
        price={product?.price || 0}
        isBase={true}
        basePrice={product?.price || 1}
        currency={product?.region?.currency?.symbol}
      />
      {urlItems.map(({ key, url, source, price, region, is_base }) => (
        <ProductURLLink
          key={key}
          url={url}
          source={source?.name}
          logo={source?.button_logo?.url}
          price={price || 0}
          basePrice={product?.price || 1}
          currency={product?.region?.currency?.symbol}
        />
      ))}
    </div>
  );
};

export default ProductLinks;
