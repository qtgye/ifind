import React, {
  useState,
  useEffect,
  useCallback,
  createContext,
  useContext,
  useRef,
} from "react";
import { useGQLFetch } from "../helpers/gqlFetch";
import axios from "axios";
const moment = require("moment");

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
  const scriptsServer = useRef();

  return async (path = "/") => {
    let baseURL = "";

    if (scriptsServer.current) {
      baseURL = scriptsServer.current;
    } else {
      console.log("Fetching Scripts Server URL...");
      const {
        data: {
          data: { env },
        },
      } = await axios.post("/graphql", {
        query: `query { env { SCIPTS_SERVER_URL } }`,
      });

      scriptsServer.current = env.SCIPTS_SERVER_URL;
      baseURL = env.SCIPTS_SERVER_URL;
    }

    return [baseURL.replace(/\/+$/, ""), path.replace(/^\/+/, "")].join("/");
  };
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
  const [limit, setLimit] = useState<string | number>("");
  const [parallel, setParallel] = useState<string | number>("");

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

        // offers.push(response.data)
      })
      .catch((err) => console.log("error ", err))
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

    const url = await getScriptsServerUrl("/task/triggerTask");

    let body = {
      taskID: taskID,
      action: action,
      position: index,
    };
    // if (taskID == "ebay-wow-offers") {
    axios
      .post(url, body)
      // axios.post("https://script.ifindilu.de/task/triggerTask", body)
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
      }}
    >
      {children}
    </ScheduledTasksListContext.Provider>
  );
};

export const useScheduledTasksList = () =>
  useContext(ScheduledTasksListContext);
