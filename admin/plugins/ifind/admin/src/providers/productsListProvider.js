import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  memo
} from 'react';
import { useQuery } from '../helpers/query';
import { useGQLFetch } from '../helpers/gqlFetch';
import { useSearchParams } from '../helpers/url';

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
      productsConnection {
        aggregate {
          totalCount
        }
      }
    }
`;

const _deleteProductsMutation = (productIDs) => `
mutation DeleteProducts {
  ${
    productIDs.map(id => `
      deleteProduct${id}: deleteProduct (
        input: {
          where: { id: ${id}}
        }
      ) {
        product {
          id
        }
      }
    `)
  }
}
`;

export const ProductsListContext = createContext({});

export const ProductsListProvider = memo(({ children }) => {
  const gqlFetch = useGQLFetch();
  const searchParams = useSearchParams();

  // Query params states
  const [ sortBy, setSortBy ] = useState(searchParams?.sort_by || 'id'); // Product field
  const [ sortOrder, setSortOrder ] = useState(searchParams?.order || 'desc'); // desc|asc
  const [ pageSize, setPageSize ] = useState(Number(searchParams?.page_size || 10));
  const [ page, setPage ] = useState(Number(searchParams?.page || 1));
  const [ filters, setFilters ] = useState([]); // [{ fieldName: value }]

  const [ totalPages, setTotalPages ] = useState(1);
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

  const deleteProducts = useCallback((productIDs) => {
    return gqlFetch(_deleteProductsMutation(productIDs))
    .then(data => console.log({ data }))
  });

  const setProductsListData = useCallback(({ products, productsConnection }) => {
    setProducts(products);

    // Compute pagination
    setTotalPages(Math.ceil(productsConnection?.aggregate?.totalCount / pageSize) || 1);
  }, [ pageSize ]);

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
      setProductsListData(data);
    }
  }, [ data, setProductsListData ]);

  return (
    <ProductsListContext.Provider value={{
      products,
      // Values
      page,
      pageSize,
      sortBy,
      sortOrder,
      filters,
      totalPages,
      // Setters
      setPage,
      setPageSize,
      setSortBy,
      setSortOrder,
      setFilters,
      // Additionals
      refresh,
      deleteProducts,
    }}>
      {children}
    </ProductsListContext.Provider>
  );
});

export const useProductsList = () => {
  return useContext(ProductsListContext);
};