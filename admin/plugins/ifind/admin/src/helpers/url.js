import { useCallback, useState, useEffect } from 'react';
import pluginId from '../pluginId';
import { useLocation } from 'react-router-dom';

export const mapSearchParam = () => (
  window.location.search
    .slice(1)
    .split('&')
    .filter(Boolean)
    .map(keyValue => keyValue.split('='))
    .reduce((all, [ key, value ]) => ({
      ...all,
      [key]: value
    }), {})
);

export const getSearchParams = () => {
  return mapSearchParam();
}

export const useSearchParams = () => {
  const { search } = useLocation();
  const [ searchParams, setSearchParams ] = useState(getSearchParams());

  useEffect(() => {
    setSearchParams(getSearchParams());
  }, [ search ]);

  return searchParams;
};

const toSearchParams = (paramsObject = {}) => {
  const searchParams = getSearchParams();
  const entries = Object.entries({
    ...searchParams,
    ...paramsObject,
  });

  return (
    entries.length ?
    '?' + entries.map(entry => entry.join('=')).join('&') :
    ''
  )
}

export const generatePluginLink = (relativeToPlugin = null, _searchParams = false, withParentRoute = false) => {
  const adminRoot = withParentRoute ? '/admin' : '';
  const searchParams = _searchParams ? toSearchParams(_searchParams) : '';

  if ( !relativeToPlugin ) {
    return window.location.pathname.replace(/^\/admin/, adminRoot) + searchParams;
  }

  return `${adminRoot}/plugins/${pluginId}/${relativeToPlugin.replace(/^\//,'')}${searchParams}`;
};