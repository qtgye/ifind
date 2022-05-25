import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from "react";
import { useGQLFetch } from "../helpers/gqlFetch";
import axios from 'axios';

// Context
export const ScheduledTasksListContext =
  createContext<I_ScheduledTasksProviderValue>({});

export const tasksListsQuery = `
query {
  scheduledTasksList {
    serverTimeFormatted
    tasks {
      id
      name
      status
      frequency
      last_run
      hasModule
      countdown
    }
    logs {
      date_time
      type
      message
    }
  }
}
`;

export const triggerTaskQuery = `
mutation TriggerTask (
  $taskID: String
  $action: SCHEDULED_TASK_ACTION
) {
  triggerTask(
    taskID: $taskID
    action: $action
  ) {
    serverTimeFormatted
    tasks {
      id
      name
      status
      frequency
      next_run
      hasModule
    }
  }
}
`;

// Provider
export const ScheduledTasksListProvider = ({ children }: I_ComponentProps) => {
  const gqlFetch = useGQLFetch();
  const isMountedRef = useRef(true);
  const [tasks, setTasks] = useState<I_RawTask[]>([]);
  const [logs, setLogs] = useState<I_LogEntry[]>([]);
  const [serverTimeUnix, setServerTimeUnix] = useState<string | number>("");
  const [serverTimeFormatted, setServerTimeFormatted] = useState<string>("");

  // Existing Code : 

  // const fetchTasksList = useCallback(async () => {
  //   gqlFetch(tasksListsQuery)
  //     .then((data) => {
  //       if (data?.scheduledTasksList?.tasks) {
  //         setTasks(data.scheduledTasksList.tasks);
  //       }
  //       if (data?.scheduledTasksList?.serverTimeUnix) {
  //         setServerTimeUnix(data.scheduledTasksList.serverTimeUnix);
  //       }
  //       if (data?.scheduledTasksList?.serverTimeFormatted) {
  //         setServerTimeFormatted(data.scheduledTasksList.serverTimeFormatted);
  //       }
  //       if (data?.scheduledTasksList?.logs) {
  //         setLogs(data.scheduledTasksList.logs);
  //       }
  //     })
  //     .catch((err) => err)
  //     .finally(() => {
  //       if ( isMountedRef.current ) {
  //         window.setTimeout(() => fetchTasksList(), 1000);
  //       }
  //     });
  // }, [tasksListsQuery, gqlFetch, isMountedRef]);


  const fetchTasksList = useCallback(async () => {
    axios.post("https://script.ifindilu.de/task/getTaskList")
      .then((response) => {
        setTasks(response.data.tasks);
        // offers.push(response.data)
      })
      .catch((err) => console.log("error ", err))
      .finally(() => {
        if (isMountedRef.current) {
          window.setTimeout(() => fetchTasksList(), 1000);
        }
      });
  }, [isMountedRef]);

  // const triggerTask = useCallback(
  //   (taskID, action) => {
  //     gqlFetch(triggerTaskQuery, {
  //       taskID,
  //       action,
  //     });
  //   },
  //   [useGQLFetch]
  // );

  const triggerTask = useCallback(
    (taskID, action) => {
      console.log("TriggerTask Called");
      console.log("taskId : ", taskID);
      console.log("Action :", action);
      let scrapedProducts = null
      let body ={
        taskID : taskID,
        action : action
      }
      if (taskID == "ebay-wow-offers") {
        axios.post("https://script.ifindilu.de/ebay/fetchEbayStore", body)
        .then(
          (response) => {
            scrapedProducts = response.data.data;
            // offers.push(response.data)
          },
          (error) => {
            console.log(error);
          }
        );
      }
      else if (taskID == "amazon-lightning-offers") {
        axios.post("https://script.ifindilu.de/amazon/getAmazonProducts").then(
          (response) => {
            scrapedProducts = response.data.data;
            // offers.push(response.data)
          },
          (error) => {
            console.log(error);
          }
        );
      }
      else if (taskID == "mydealz-highlights") {
        axios.post("https://script.ifindilu.de/mydealz/getMyDealsProduct").then(
          (response) => {
            scrapedProducts = response.data.data;
            // offers.push(response.data)
          },
          (error) => {
            console.log(error);
          }
        );
      }
      else if (taskID == "aliexpress-value-deals") {
        axios.post("https://script.ifindilu.de/aliexpress/getAliExpressData").then(
          (response) => {
            scrapedProducts = response.data.data;
            // offers.push(response.data)
          },
          (error) => {
            console.log(error);
          }
        );
      }
    },
    []
  );

  const startTask = useCallback((taskID) => {
    triggerTask(taskID, "start");
  }, []);

  const stopTask = useCallback((taskID) => {
    triggerTask(taskID, "stop");
  }, []);

  useEffect(() => {
    fetchTasksList();

    return () => {
      isMountedRef.current = false;
    }
  }, []);

  return (
    <ScheduledTasksListContext.Provider
      value={{
        tasks,
        startTask,
        stopTask,
        serverTimeUnix,
        serverTimeFormatted,
        logs,
      }}
    >
      {children}
    </ScheduledTasksListContext.Provider>
  );
};

export const useScheduledTasksList = () =>
  useContext(ScheduledTasksListContext);
