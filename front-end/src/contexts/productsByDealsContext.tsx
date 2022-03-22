import { createContext, useContext, useState, useEffect } from "react";
import { useParams } from "react-router";
import { useQuery } from "@apollo/react-hooks";
import productsByDealsQuery from "@gql/productsByDealsQuery";

import {
  GlobalStateContextProvider,
  useGlobalState,
} from "./globalStateContext";

export const ProductsByDealsContext = createContext<ProductsByDealsValues>({});

export const ProductsByDealsContextProvider = ({
  children,
}: ProductsByDealsContextProviderProps) => {
  const { setActiveOffer } = useGlobalState();
  const { offer_id } = useParams<{ offer_id: string }>();
  const [productsByDeals, setProductsByDeals] = useState<ProductsByDeal[]>([]);
  const { loading, error, data } = useQuery(productsByDealsQuery, {
    variables: { offer_id },
  });

  useEffect(() => {
    if (setActiveOffer && offer_id) {
      setActiveOffer(offer_id);
    }
  }, [setActiveOffer, offer_id]);

  useEffect(() => {
    setProductsByDeals(data?.productsByDeals || []);
  }, [data]);

  return (
    <GlobalStateContextProvider>
      <ProductsByDealsContext.Provider
        value={{
          loading,
          error,
          productsByDeals,
        }}
      >
        {children}
      </ProductsByDealsContext.Provider>
    </GlobalStateContextProvider>
  );
};

// Supply a name in order to check for it outside
ProductsByDealsContextProvider.providerName = "ProductsByDealsContextProvider";

export const useProductsByDeals = () => useContext(ProductsByDealsContext);

// Export as default to be used in testing
export default ProductsByDealsContext;
