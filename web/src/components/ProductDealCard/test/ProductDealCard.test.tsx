import { render } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";

import ProductDealCard from "..";
import {
  amazonProductWithoutAttributes,
  ebayWowOfferProduct,
  aliExpressValueDealProduct,
} from "@mocks/content-types/product";

describe("ProductDealCard Component", () => {
  it("Renders basic amazon product", () => {
    render(
      <BrowserRouter>
        <ProductDealCard {...amazonProductWithoutAttributes} />
      </BrowserRouter>
    );

    const cardElement = document.querySelector(
      ".product-deal-card"
    ) as HTMLAnchorElement;
    const imageElement = cardElement?.querySelector("img");
    const titleElement = cardElement?.querySelector(
      ".product-deal-card__title"
    );

    expect(cardElement).toBeInstanceOf(window.HTMLAnchorElement);
    expect(cardElement).toHaveAttribute(
      "href",
      amazonProductWithoutAttributes.amazon_url
    );
    expect(imageElement?.src).not.toBeFalsy();
    expect(titleElement).not.toBeEmptyDOMElement();
  });

  it("Renders an Ebay Wow Offer", () => {
    render(
      <BrowserRouter>
        <ProductDealCard {...ebayWowOfferProduct} />
      </BrowserRouter>
    );

    const ebaySaleDetails = ebayWowOfferProduct.url_list.find(({ source }) =>
      /ebay/i.test(source.name)
    );

    const cardElement = document.querySelector(
      ".product-deal-card"
    ) as HTMLAnchorElement;
    const priceDiscountedElement = cardElement.querySelector(
      ".product-deal-card__price-discounted"
    );
    const priceOriginalElement = cardElement.querySelector(
      ".product-deal-card__price-original"
    );
    const discountElement = cardElement.querySelector(
      ".product-deal-card__discount"
    );
    const percentElement = cardElement.querySelector(".percent-circle__number");

    expect(cardElement).toBeInstanceOf(window.HTMLAnchorElement);
    expect(priceDiscountedElement).toHaveTextContent(
      `€${ebaySaleDetails?.price}`
    );
    expect(priceOriginalElement).toHaveTextContent(
      String(ebaySaleDetails?.price_original)
    );
    expect(discountElement).toHaveTextContent(
      String(ebaySaleDetails?.discount_percent)
    );
    expect(percentElement).toHaveTextContent(
      String(ebaySaleDetails?.quantity_available_percent)
    );
  });

  it("Renders an AliExpress Super Value Deal", () => {
    render(
      <BrowserRouter>
        <ProductDealCard {...aliExpressValueDealProduct} />
      </BrowserRouter>
    );

    const aliExpressSaleDetails = aliExpressValueDealProduct.url_list.find(
      ({ source }) => /aliexpress/i.test(source.name)
    );

    const cardElement = document.querySelector(
      ".product-deal-card"
    ) as HTMLAnchorElement;
    const priceDiscountedElement = cardElement.querySelector(
      ".product-deal-card__price-discounted"
    );
    const priceOriginalElement = cardElement.querySelector(
      ".product-deal-card__price-original"
    );
    const discountElement = cardElement.querySelector(
      ".product-deal-card__discount"
    );

    expect(cardElement).toBeInstanceOf(window.HTMLAnchorElement);
    expect(priceDiscountedElement).toHaveTextContent(
      `€${aliExpressSaleDetails?.price}`
    );
    expect(priceOriginalElement).toHaveTextContent(
      String(aliExpressSaleDetails?.price_original)
    );
    expect(discountElement).toHaveTextContent(
      String(aliExpressSaleDetails?.discount_percent)
    );
  });
});
