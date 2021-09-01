import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  FunctionComponent,
} from "react";
import { useParams } from "react-router-dom";
import { useGQLFetch } from "../helpers/gqlFetch";

interface BackgroundProcessRouteParam {
  backgroundProcess: string;
}

export const backgroundProcessQuery = `
query GetBackgroundProcess (
  $backgroundProcess: BACKGROUND_PROCESS_NAME!
) {
  getBackgroundProcess ( backgroundProcess: $backgroundProcess ) {
    status
    logs {
      date_time
      message
      type
    }
  }
}
`;

export const BackgroundProcessContext = createContext({});

export const BackgroundProcessProvider: FunctionComponent = ({ children }) => {
  const { backgroundProcess }: BackgroundProcessRouteParam = useParams();
  const gqlFetch = useGQLFetch();

  const [ logs, setLogs ] = useState([]);
  const [ status, setStatus ] = useState(null);

  const fetchBackgroundProcess = useCallback(
    async (backgroundProcessName: string) => {
      const data = await gqlFetch(backgroundProcessQuery, {
        backgroundProcess: backgroundProcessName.replace("-", "_"),
      });

      if ( data?.getBackgroundProcess ) {
        setLogs(data.getBackgroundProcess?.logs || []);
        setStatus(data.getBackgroundProcess?.status || null);
      }
    },
    []
  );

  useEffect(() => {
    if (backgroundProcess) {
      fetchBackgroundProcess(backgroundProcess);
    }
  }, [backgroundProcess]);

  return (
    <BackgroundProcessContext.Provider
      value={
        {
          status,
          logs,
          // start,
          // stop,
          // getLogs,
        }
      }
    >
      {children}
    </BackgroundProcessContext.Provider>
  );
};

export const useBackgroundProcess = () => useContext(BackgroundProcessContext);
