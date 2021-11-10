import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from "react";
import { useGQLFetch } from "../helpers/gqlFetch";

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
      next_run
      hasModule
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

  const fetchTasksList = useCallback(async () => {
    gqlFetch(tasksListsQuery)
      .then((data) => {
        if (data?.scheduledTasksList?.tasks) {
          setTasks(data.scheduledTasksList.tasks);
        }
        if (data?.scheduledTasksList?.serverTimeUnix) {
          setServerTimeUnix(data.scheduledTasksList.serverTimeUnix);
        }
        if (data?.scheduledTasksList?.serverTimeFormatted) {
          setServerTimeFormatted(data.scheduledTasksList.serverTimeFormatted);
        }
        if (data?.scheduledTasksList?.logs) {
          setLogs(data.scheduledTasksList.logs);
        }
      })
      .catch((err) => err)
      .finally(() => {
        if ( isMountedRef.current ) {
          window.setTimeout(() => fetchTasksList(), 1000);
        }
      });
  }, [tasksListsQuery, gqlFetch, isMountedRef]);

  const triggerTask = useCallback(
    (taskID, action) => {
      gqlFetch(triggerTaskQuery, {
        taskID,
        action,
      });
    },
    [useGQLFetch]
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
