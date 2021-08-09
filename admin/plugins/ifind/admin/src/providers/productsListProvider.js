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

const buildProductsQuery = (where) => {
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
        sort: $sort,
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
  const [ loading, setLoading ] = useState(false);
  const [ requestTimeout, setRequestTimeout ] = useState(null);
  const [ searchTerm, setSearchTerm ] = useState('');

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

  const [ listOptions, setListOptions ] = useState({
    sortBy: searchParams?.sort_by || 'id', // Product field
    sortOrder: searchParams?.order || 'desc', // desc|asc
    pageSize: Number(searchParams?.page_size || 10),
    page: Number(searchParams?.page || 1),
    filters: getFiltersObject(), // { fieldName: value }
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
    page
  }) => {
    const limit = pageSize;
    const start = pageSize * (page - 1);
    const sort = `${sortBy}:${sortOrder}`;

    return { limit, start, sort }
  }, []);

  const refresh = useCallback(() => {
    clearTimeout(requestTimeout);

    setRequestTimeout(setTimeout(async () => {
      setLoading(true);
      const data = await gqlFetch(queryOptions.query, queryOptions.variables);
      
      if ( data?.products ) {
        setProductsListData(data);
      }
      setLoading(false);
    }), 300);
  }, [ queryOptions, requestTimeout ]);

  const deleteProducts = useCallback((productIDs) => {
    return gqlFetch(_deleteProductsMutation(productIDs))
    .then(data => console.log({ data }))
  });

  const setProductsListData = useCallback(({ products, productsConnection }) => {
    const searchTermPattern = searchTerm ? new RegExp(searchTerm, 'i') : null;
    const filteredProductsBySearch = products.filter(({ title }) => (
      searchTermPattern ? searchTermPattern.test(title) : true
    ));

    setProducts(filteredProductsBySearch);

    // Compute pagination
    setTotalPages(Math.ceil(productsConnection?.aggregate?.totalCount / listOptions.pageSize) || 1);
  }, [ listOptions, searchTerm ]);

  // Update queryVars on change of sortBy, sortOrder, pageSize, page
  useEffect(() => {
    const variables = buildQueryVars({
      sortBy: listOptions.sortBy,
      sortOrder: listOptions.sortOrder,
      pageSize: listOptions.pageSize,
      page: listOptions.page,
    });
    const query = buildProductsQuery(listOptions.filters);

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
      filters: getFiltersObject(),
     });

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
      totalPages,
      setSearchTerm,
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