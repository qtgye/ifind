import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers/authProvider';

export const useQuery = (query, variables) => {
  const { jwt } = useAuth();
  const [ queryTemplate ] = useState({
    loading: true,
    data: null,
    error: null,
  });
  const [ queries, setQueries ] = useState({});

  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(null);
  const [ data, setData ] = useState(data);

  const callQuery = useCallback((query, variables) => {
    return window.fetch(`/graphql`, {
      method: 'post',
      headers: {
        authorization: `Bearer ${jwt}`,
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        query,
        variables: variables || {}
      })
    })
    .then(res => res.json());
  });

  useEffect(() => {
    console.log({ jwt });
    if ( jwt ) {
      callQuery(query, variables)
      .then(({ data }) => setData(data))
      .catch(error => setError(error))
    }
  }, [ jwt ]);

  useEffect(() => {
    console.log({ data, error });
    if ( data || error ) {
      setLoading(false);
    }
  }, [ error, data ]);

  return {
    loading,
    error,
    data,
  };

}