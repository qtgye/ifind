import React, {
  createContext,
  useState,
  useEffect,
  useContext
} from 'react';
import { useQuery } from '../helpers/query';

const sourcesRegionsQuery = `
  query {
    sources {
      id
      name
      regions {
        id
        name
      }
    }
    regions {
      id
      name
    }
  }
`;

export const SourceRegionContext = createContext({});

export const SourceRegionProvider = ({ children }) => {
  const [ sources, setSources ] = useState([]);
  const [ regions, setRegions ] = useState([]);
  const {
    data,
    loading,
    error,
  } = useQuery(sourcesRegionsQuery);

  useEffect(() => {
    if ( data?.sources ) {
      setSources(data.sources);
    }
    if ( data?.regions ) {
      setRegions(data.regions);
    }
  }, [ data ]);

  return (
    <SourceRegionContext.Provider value={{ sources, regions, loading }}>
      {children}
    </SourceRegionContext.Provider>
  );
}

export const useSourceRegion = () => {
  return useContext(SourceRegionContext);
};