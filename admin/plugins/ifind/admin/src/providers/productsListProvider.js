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
  position
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
  category {
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

const productsListQuery = `
  ${ProductFragment}
  query ProductsList (
    $limit: Int!
    $start: Int!
    $sort: String!
    $search: String
    $category: ID
    $status: String
    ) {
      productsList (
        limit: $limit
        start: $start
        sort: $sort
        where: {
          search: $search,
          category: $category
          status: $status
        }
        ) {
          count
          products {
            ... ProductFragment
          }
        }
      }
  `
;

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
  const [ loading, setLoading ] = useState(false);
  const [ requestTimeout, setRequestTimeout ] = useState(null);
  const [ searchTerm, setSearchTerm ] = useState(searchParams.search);
  const [ status, setStatus ] = useState(searchParams.status);

  const [ listOptions, setListOptions ] = useState({
    sortBy: searchParams?.sort_by || 'id', // Product field
    sortOrder: searchParams?.order || 'desc', // desc|asc
    pageSize: Number(searchParams?.page_size || 10),
    page: Number(searchParams?.page || 1),
    category: searchParams?.category || '',
    search: searchParams?.search || '',
    status: searchParams?.status || 'published',
  });

  const [ totalPages, setTotalPages ] = useState(1);
  const [ queryOptions, setQueryOptions ] = useState({
    query: null,
    variables: {},
  });

  const [ products, setProducts ] = useState([]);

  const buildQueryVars = useCallback(({
    sortBy,
    sortOrder,
    pageSize,
    page,
    category,
    search,
    status
  }) => {
    const limit = pageSize;
    const start = pageSize * (page - 1);
    const sort = `${sortBy}:${sortOrder}`;

    return { limit, start, sort, category, search, status };
  }, []);

  const refresh = useCallback(() => {
    clearTimeout(requestTimeout);

    setRequestTimeout(setTimeout(async () => {
      setLoading(true);
      const data = await gqlFetch(queryOptions.query, queryOptions.variables);

      if ( data?.productsList ) {
        setProductsListData(data.productsList);
      }
      setLoading(false);
    }), 300);
  }, [ queryOptions, requestTimeout ]);

  const deleteProducts = useCallback((productIDs) => {
    return gqlFetch(_deleteProductsMutation(productIDs))
    .then(data => console.log({ data }))
  });

  const setProductsListData = useCallback(({ products, count }) => {
    setProducts(products);

    // Compute pagination
    setTotalPages(Math.ceil((count || 0) / listOptions.pageSize) || 1);
  }, [ listOptions, searchTerm ]);

  // Update queryVars on change of sortBy, sortOrder, pageSize, page
  useEffect(() => {
    const variables = buildQueryVars({
      sortBy: listOptions.sortBy,
      sortOrder: listOptions.sortOrder,
      pageSize: listOptions.pageSize,
      page: listOptions.page,
      category: listOptions.category,
      search: listOptions.search,
      status: listOptions.status,
    });
    const query = productsListQuery;

    setQueryOptions({ query, variables });
  }, [ listOptions ]);

  useEffect(() => {
    refresh();
  }, [ queryOptions ]);

  useEffect(() => {
     setListOptions({
      page: Number(searchParams?.page || 1),
      pageSize: Number(searchParams?.page_size || 10),
      sortBy: searchParams?.sort_by || 'id',
      sortOrder: searchParams?.order || 'desc',
      category: searchParams?.category || '',
      search: searchParams?.search || '',
      status: searchParams?.status || 'published',
     });
     setSearchTerm(searchParams.search);
     setStatus(searchParams.status);
  }, [ searchParams ]);

  return (
    <ProductsListContext.Provider value={{
      products,
      // Values
      page: listOptions.page,
      pageSize: listOptions.pageSize,
      sortBy: listOptions.sortBy,
      sortOrder: listOptions.sortOrder,
      filters: listOptions.filters,
      status: listOptions.status,
      totalPages,
      // Additionals
      loading,
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