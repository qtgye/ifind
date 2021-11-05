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
  const refetchFlag = useRef(false);
  const gqlFetch = useGQLFetch();
  const [tasks, setTasks] = useState<I_RawTask[]>([]);
  const [serverTimeUnix, setServerTimeUnix] = useState<string | number>("");
  const [serverTimeFormatted, setServerTimeFormatted] = useState<string>("");

  // Continuously called for realtime update
  const fetchTasksList = useCallback(async () => {
    await Promise.all([
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
        })
        .catch((err) => err),
      new Promise((resolve) => setTimeout(resolve, 1000)),
    ]);

    if (refetchFlag.current) {
      fetchTasksList();
    }
  }, [tasksListsQuery, gqlFetch, refetchFlag]);

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
    refetchFlag.current = true;
    fetchTasksList();

    return () => {
      refetchFlag.current = false;
    };
  }, [refetchFlag]);

  return (
    <ScheduledTasksListContext.Provider
      value={{ tasks, startTask, stopTask, serverTimeUnix, serverTimeFormatted }}
    >
      {children}
    </ScheduledTasksListContext.Provider>
  );
};

export const useScheduledTasksList = () =>
  useContext(ScheduledTasksListContext);
