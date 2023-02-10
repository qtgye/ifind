import { createContext, useContext, useState, useEffect } from "react";
import gqlFetch from "utilities/gqlFetch";

export const ProductsByDealsContext = createContext<ProductsByDealsValues>({});

export const ProductsByDealsContextProvider = ({
  children,
  productsByDeals = [],
}: ProductsByDealsContextProviderProps) => {
  return (
    <ProductsByDealsContext.Provider
      value={{
        productsByDeals,
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
        deal_merchant
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
