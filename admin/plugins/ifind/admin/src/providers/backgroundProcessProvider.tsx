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

interface I_LogEntry {
  date_time: string
  type: string
  message: string
}
interface I_BackgroundProcessRouteParam {
  backgroundProcess: string;
}
export interface I_BackgroundProcessProviderValues {
  status?: string | null
  logs?: Array<I_LogEntry|never>
  start?: () => void
  stop?: () => void
  refetch?: () => void
}


export const getBackgroundProcessQuery = `
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

export const triggerBackgroundProcessQuery = `
query TriggerBackgroundProcess (
  $backgroundProcess: BACKGROUND_PROCESS_NAME!,
  $status: BACKGROUND_PROCESS_STATUS!
) {
  triggerBackgroundProcess(
    backgroundProcess: $backgroundProcess,
    status: $status
  ) {
    status
    logs {
      date_time
      message
      type
    }
  }
}
`

export const BackgroundProcessContext = createContext({});

export const BackgroundProcessProvider: FunctionComponent = ({ children }) => {
  const { backgroundProcess }: I_BackgroundProcessRouteParam = useParams();
  const gqlFetch = useGQLFetch();

  const [ logs, setLogs ] = useState([]);
  const [ status, setStatus ] = useState(null);

  const fetchBackgroundProcess = useCallback(
    async () => {
      const data = await gqlFetch(getBackgroundProcessQuery, {
        backgroundProcess: backgroundProcess.replace("-", "_"),
      });

      if ( data?.getBackgroundProcess ) {
        setLogs(data.getBackgroundProcess?.logs || []);
        setStatus(data.getBackgroundProcess?.status || null);
      }
    },
    [ backgroundProcess ]
  );

  const triggerBackgroundProcess = useCallback(async (status: BACKGROUND_PROCESS_STATUS) => {
    const data = await gqlFetch(triggerBackgroundProcessQuery, {
      backgroundProcess: backgroundProcess.replace("-", "_"),
      status,
    });

    if ( data?.triggerBackgroundProcess ) {
      setLogs(data.triggerBackgroundProcess?.logs || []);
      setStatus(data.triggerBackgroundProcess?.status || null);
    }
  }, [ backgroundProcess ]);

  const start = useCallback(() => {
    triggerBackgroundProcess('START' as BACKGROUND_PROCESS_STATUS );
  }, [ triggerBackgroundProcess ]);

  const stop = useCallback(() => {
    triggerBackgroundProcess('STOP' as BACKGROUND_PROCESS_STATUS );
  }, [ triggerBackgroundProcess ]);

  useEffect(() => {
    if (backgroundProcess) {
      fetchBackgroundProcess();
    }
  }, [backgroundProcess]);

  return (
    <BackgroundProcessContext.Provider
      value={
        {
          status,
          logs,
          start,
          stop,
          refetch: fetchBackgroundProcess,
        } as I_BackgroundProcessProviderValues
      }
    >
      {children}
    </BackgroundProcessContext.Provider>
  );
};

export const useBackgroundProcess: () => I_BackgroundProcessProviderValues|{} = () => useContext(BackgroundProcessContext);
