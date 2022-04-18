import {
  createContext,
  PropsWithChildren,
  useContext,
  useEffect,
  useState,
} from "react";
import { useQuery } from "@apollo/react-hooks";
import { apiSourceHandle } from "config/adminApi";
import sourceRegionQuery from "../gql/getSourceRegionQuery";
import gqlFetch from "utilities/gqlFetch";

export const SourceRegionContext = createContext<SourceRegionContextData>({});

export const SourceRegionProvider = ({
  children,
}: PropsWithChildren<React.ReactNode>) => {
  const [regions, setRegions] = useState([]);
  const [sources, setSources] = useState([]);
  const { data } = useQuery(sourceRegionQuery, {
    context: {
      apiSource: apiSourceHandle,
    },
  });

  useEffect(() => {
    if (data?.regions?.length) {
      setRegions(data.regions);
    }
    if (data?.sources?.length) {
      setSources(data.sources);
    }
  }, [data]);

  return (
    <SourceRegionContext.Provider value={{ sources, regions }}>
      {children}
    </SourceRegionContext.Provider>
  );
};

export const useSourceRegion = () => useContext(SourceRegionContext);

export const getSourcesRegions = async (): Promise<SourceRegionContextData> =>
  gqlFetch(`
    query SourceRegionQuery {
      sources {
          id
          name
          button_logo {
              url
          }
      }
      regions {
          id
          name
      }
    }
`);
