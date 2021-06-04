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
    if ( !query ) {
      return Promise.resolve({ data: null });
    }

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
    if ( jwt ) {
      callQuery(query, variables)
      .then(({ data }) => setData(data))
      .catch(error => setError(error))
    }
  }, [ jwt, query, variables ]);

  useEffect(() => {
    if ( data || error ) {
      setLoading(false);
    }

    if ( error ) {
      strapi.notification.toggle({
        type: 'warning',
        title: 'Fetch error',
        message: error.message,
      });
      console.error(error);
    }
  }, [ error, data ]);

  return {
    loading,
    error,
    data,
  };

}

export const useMutation = () => {
  const { jwt } = useAuth();
  const [ loading, setLoading ] = useState(true);
  const [ error, setError ] = useState(false);
  const [ data, setData ] = useState(data);

  const callMutation = useCallback((query, variables) => {
    if ( jwt ) {
      window.fetch(`/graphql`, {
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
      .then(res => res.json())
      .then(({ data }) => setData(data))
      .catch(error => setError(error))
    }
  }, [ jwt ]);

  useEffect(() => {
    if ( data || error ) {
      console.log({ error });
      setLoading(false);
    }
  }, [ error, data ]);

  return [
    callMutation,
    {
      loading,
      error,
      data,
    }
  ];
}