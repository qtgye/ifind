import { useCallback, useState } from 'react';
import pluginId from '../pluginId';
import { useLocation } from 'react-router-dom';

export const mapSearchParam = () => (
  window.location.search
    .slice(1)
    .split('&')
    .map(keyValue => keyValue.split('='))
    .reduce((all, [ key, value ]) => ({
      ...all,
      [key]: value
    }), {})
);

export const useSearchParams = () => {
  return mapSearchParam();
}

const toSearchParams = (paramsObject = {}) => {
  const searchParams = useSearchParams();
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

export const generatePluginLink = (relativeToPlugin = null, _searchParams = {}, withParentRoute = false) => {
  const adminRoot = withParentRoute ? '/admin' : '';
  const searchParams = toSearchParams(_searchParams);

  if ( !relativeToPlugin ) {
    return window.location.pathname.replace(/^\/admin/, adminRoot) + searchParams;
  }

  return `${adminRoot}/plugins/${pluginId}/${relativeToPlugin}${searchParams}`;
};