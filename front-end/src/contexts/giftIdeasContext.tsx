import React, {
  createContext,
  useState,
  useContext,
  useEffect,
} from "react";
import { useQuery } from "@apollo/client";
import sourceRegionQuery from "@gql/giftIdeasQuery";
import { useSearchParams } from '@utilities/url';

export const GiftIdeasContext = createContext<GiftIdeasContextData>({});

export const GiftIdeasProvider = ({
  children,
}: React.PropsWithChildren<any>) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState<number>(0);
  const {
    page = 1,
    tags = '',
  } = useSearchParams();
  const { data } = useQuery(sourceRegionQuery, {
    variables: {
      page: Number(page),
      tags: tags.split(',').filter(Boolean)
    }
  });

  useEffect(() => {
    if (data?.giftIdeas) {
      setProducts(data.giftIdeas.products || []);
      setTotal(data.giftIdeas.total || 0);
    }
  }, [data]);

  return (
    <GiftIdeasContext.Provider value={{ products, total }}>
      {children}
    </GiftIdeasContext.Provider>
  );
};

export const useGiftIdeas = () => useContext(GiftIdeasContext);
