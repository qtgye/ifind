import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from "react";
const moment = require("moment");
import { useGQLFetch } from "../helpers/gqlFetch";
import axios from "axios";
import { post, scriptsServerUrl } from '../helpers/scripts-server/request';

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

export const useScriptsServerUrl = () => {
  return scriptsServerUrl;
};

// Provider
export const ScheduledTasksListProvider = ({ children }: I_ComponentProps) => {
  const gqlFetch = useGQLFetch();
  const isMountedRef = useRef(true);
  const getScriptsServerUrl = useScriptsServerUrl();
  const [tasks, setTasks] = useState<I_RawTask[]>([]);
  const [logs, setLogs] = useState<I_LogEntry[]>([]);
  const [serverTimeUnix, setServerTimeUnix] = useState<string | number>("");
  const [serverTimeFormatted, setServerTimeFormatted] = useState<string>("");
  const [isTaskAdded, setIsTaskAdded] = useState<I_RawTask[]>([]);
  const [queue, setQueue] = useState<I_QueueItem[]>([]);
  const [limit, setLimit] = useState<string | number>("");
  const [parallel, setParallel] = useState<string | number>("");
  const [full, setFull] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const fetchTasksList = useCallback(async () => {
    const serverTime = moment.utc();
    const serverTimeUnix = String(serverTime.valueOf());
    const serverTimeFormatted = serverTime.format("YYYY-MMM-DD HH:mm:ss");
    setServerTimeFormatted(serverTimeFormatted);

    const url = await getScriptsServerUrl("/task/getTaskList");

    await axios
      .post(url)
      .then((response) => {
        setTasks(response.data.tasks);
        setLogs(response.data.logs);
        setIsTaskAdded(response.data.isTaskAdded);
        setLimit(response.data.limit);
        setParallel(response.data.parallel);
        setQueue(response.data.queue);
        setFull(response.data.full || false);
        setError('');
      })
      .catch((err) => {
        setTasks([]);
        setLogs([]);
        setIsTaskAdded([]);
        setQueue([]);
        setFull(false);
        setError(err.message);
        console.log("error ", err);
      })
      .finally(() => {
        if (isMountedRef.current) {
          window.setTimeout(() => fetchTasksList(), 1000);
        }
      });
  }, [isMountedRef, getScriptsServerUrl]);

  const triggerTask = useCallback(async (taskID, action, index) => {
    console.log("TriggerTask Called");
    console.log("taskId : ", taskID);
    console.log("Action :", action);
    console.log("index:", index);
    let scrapedProducts = null;

    let body = {
      taskID: taskID,
      action: action,
      position: index,
    };

    post("/task/triggerTask", body)
      .then(
        (response) => {
          console.log("Response received from API");
          // offers.push(response.data)
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  const startTask = useCallback((taskID, index) => {
    triggerTask(taskID, "start", index);
  }, []);

  const stopTask = useCallback((taskID, index) => {
    triggerTask(taskID, "stop", index);
  }, []);

  useEffect(() => {
    fetchTasksList();

    return () => {
      isMountedRef.current = false;
    };
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
        isTaskAdded,
        limit,
        parallel,
        error,
        queue,
        full
      }}
    >
      {children}
    </ScheduledTasksListContext.Provider>
  );
};

export const useScheduledTasksList = () =>
  useContext(ScheduledTasksListContext);
