import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  useCallback,
  memo
} from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '../helpers/query';
import { useGQLFetch } from '../helpers/gqlFetch';
import { getSearchParams, useSearchParams } from '../helpers/url';

const ProductFragment = `
fragment ProductFragment on Product {
  id
  title
  image
  url_list {
    source { id  }
    region { id }
    url
  }
  created_at
  updated_at
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

const _productsQuery = (where) => {
  console.log({ where });
  
  return `
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
          Object.entries(where).map(([ key, value ]) => (
            `${key === 'category' ? 'categories_contains' : key}: ${value}`
          )).join(',')
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
  `
};

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
  const [ filters, setFilters ] = useState({}); // { fieldName: value }

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

  const getFiltersObject = useCallback(() => {
    if ( searchParams?.filters ) {
      return searchParams.filters
        .split(',')
        .map(filterString => filterString.split(':'))
        .reduce((all, [ key, value ]) => ({
          ...all,
          [key]: value
        }), {});
    }

    return {};
  }, [ searchParams ]);

  // Update query on filters change
  useEffect(() => {
    const newProductsQuery = _productsQuery(filters);
    console.log({ newProductsQuery });
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

  useEffect(() => {
     setSortBy(searchParams?.sort_by || 'id');
     setSortOrder(searchParams?.order || 'desc');
     setPageSize(Number(searchParams?.page_size || 10));
     setPage(Number(searchParams?.page || 1));

     setFilters(getFiltersObject());

  }, [ searchParams ]);

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