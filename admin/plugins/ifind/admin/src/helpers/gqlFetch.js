import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../providers/authProvider';

export const useGQLFetch = () => {
  const { jwt } = useAuth();

  const gqlFetch = useCallback((query, variables) => (
    jwt
    ? window.fetch(`/graphql`, {
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
    .then(({ data }) => data)
    : Promise.resolve(null)
  ), [ jwt ])

  return gqlFetch;
}