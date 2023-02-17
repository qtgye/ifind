import { createContext, useContext, useState, useEffect } from "react";
import gqlFetch from "utilities/gqlFetch";

export const ProductsByDealsContext = createContext<ProductsByDealsValues>({});

export const ProductsByDealsContextProvider = ({
  children,
  productsByDeals = [],
}: ProductsByDealsContextProviderProps) => {
  // Sort products by:
  // 1. availability (asc), then
  // 2. discount (desc)
  const proccesedProductsByDeals = productsByDeals.map((productsByDeal) => {
    const productsByAvailability: Record<string, Product[]> = {};

    // Sort products by discount first
    productsByDeal.products.sort((productA, productB) => {
      const productAdiscount = productA.url_list?.length
        ? productA.url_list[0]?.discount_percent ||
          productA.discount_percent ||
          0
        : 0;
      const productBdiscount = productB.url_list?.length
        ? productB.url_list[0]?.discount_percent ||
          productB.discount_percent ||
          0
        : 0;
      return productAdiscount > productBdiscount ? -1 : 1;
    });

    // Group products by availability
    productsByDeal.products.forEach((product) => {
      const availability = String(
        product.url_list?.length &&
          product.url_list[0]?.quantity_available_percent
          ? product.url_list[0].quantity_available_percent
          : product.deal_quantity_available_percent ||
              product.quantity_available_percent ||
              100
      );

      productsByAvailability[availability] =
        productsByAvailability[availability] || [];
      productsByAvailability[availability].push(product);
    });

    // Sort products per availability
    const availabilities = Object.keys(productsByAvailability);
    availabilities.sort((a, b) => (Number(a) > Number(b) ? 1 : -1));
    productsByDeal.products = availabilities.reduce(
      (sortedProducts: Product[], availability) => {
        sortedProducts.push(...productsByAvailability[availability]);
        return sortedProducts;
      },
      []
    );

    return productsByDeal;
  });

  return (
    <ProductsByDealsContext.Provider
      value={{
        productsByDeals: proccesedProductsByDeals,
      }}
    >
      {children}
    </ProductsByDealsContext.Provider>
  );
};

// Supply a name in order to check for it outside
ProductsByDealsContextProvider.providerName = "ProductsByDealsContextProvider";

export const getProductsByDeals = async (offer_id: string = "") =>
  gqlFetch<ProductsByDealsPayload>(
    `
  query ProductsByDealsQuery($offer_id: String) {
    productsByDeals(offer_category: $offer_id) {
      deal_type {
        name
        source {
          name
        }
        label {
          language
          label
        }
        last_run
        nav_label {
          label
          language
        }
        nav_icon {
          type
          icon
        }
        site
        id
      }
      total_products
      products {
        id
        amazon_url
        price
        price_original
        discount_percent
        quantity_available_percent
        title
        deal_type
        deal_expiry
        deal_quantity_available_percent
        created_at
        image
        url_list {
          source {
            id
            name
          }
          region {
            id
          }
          price
          url
          price_original
          discount_percent
          quantity_available_percent
        }
      }
    }
  }
`,
    { offer_id }
  );

export const useProductsByDeals = () => useContext(ProductsByDealsContext);
