import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  memo
} from 'react';
import { useQuery } from '../helpers/query';

const ProductFragment = `
fragment ProductFragment on Product {
  id
  title
  image
  url
  source {
    id
  }
  region {
    id
  }
  categories {
    id
    label {
      label
      language {
        code
      }
    }
  }
}
`;

const _productsQuery = (where) => `
${ProductFragment}
query ProductsList (
  $limit: Int!,
  $start: Int!,
  $sort: String!
  ) {
    products (
      limit: $limit,
      start: $start,
      sort:$sort,
      where: {${
        Object.entries(where).map(([ key, value ]) => `${key}: ${value}`).join(',')
      }}
      ) {
        ... ProductFragment
      }
    }
`;

export const ProductsListContext = createContext({});

export const ProductsListProvider = memo(({ children }) => {
  // Query params states
  const [ sortBy, setSortBy ] = useState('id'); // Product field
  const [ sortOrder, setSortOrder ] = useState('desc'); // desc|asc
  const [ pageSize, setPageSize ] = useState(10);
  const [ page, setPage ] = useState(1);
  const [ filters, setFilters ] = useState([]); // [{ fieldName: value }]

  const [ productsQuery, setProductsQuery ] = useState(null);
  const [ queryVars, setQueryVars ] = useState({});
  const [ products, setProducts ] = useState([]);
  const {
    data,
    loading,
    error,
    refetch,
  } = useQuery(productsQuery, queryVars);

  const buildQueryVars = useCallback(({
    sortBy,
    sortOrder,
    pageSize,
    page
  }) => {
    const limit = pageSize;
    const start = pageSize * (page - 1);
    const sort = `${sortBy}:${sortOrder}`;

    return { limit, start, sort }
  }, []);

  const refresh = useCallback(() => {
    if ( Object.keys(queryVars).length ) {
      refetch();
    }
  }, [ refetch, queryVars ]);

  // Update query on filters change
  useEffect(() => {
    const whereParams = filters.reduce((where, [ key, value]) => ({
      ...where,
      [key]: value,
    }), {});
    const newProductsQuery = _productsQuery(whereParams);
    setProductsQuery(newProductsQuery);
  }, [ filters ]);

  // Update queryVars on change of sortBy, sortOrder, pageSize, page
  useEffect(() => {
    const _queryVars = buildQueryVars({ sortBy, sortOrder, pageSize, page });
    setQueryVars(_queryVars);
  }, [ sortBy, sortOrder, pageSize, page ]);

  useEffect(() => {
    refresh();
  }, [ queryVars, productsQuery ]);

  useEffect(() => {
    if ( data?.products ) {
      setProducts(data.products);
    }
  }, [ data ]);

  return (
    <ProductsListContext.Provider value={{
      products,
      setFilters,
      setPage,
      setPageSize,
      setSortBy,
      setSortOrder,
      refresh
    }}>
      {children}
    </ProductsListContext.Provider>
  );
});

export const useProductsList = () => {
  return useContext(ProductsListContext);
};