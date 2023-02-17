import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import moment from "moment";
import { post } from "../helpers/scripts-server/request";
import { useScriptsServerUrl } from "../providers/scheduledTasksListProvider";
import axios from "axios";

export const ScheduledTaskContext = createContext<
  Partial<ScheduledTaskContextData>
>({});

export const ScheduledTaskProvider = ({
  children,
}: React.PropsWithChildren<any>) => {
  const getScriptsServerUrl = useScriptsServerUrl();
  const { taskID } = useParams<ScheduledTaskRouteParams>();
  const [task, setTask] = useState<Task>();
  const [serverTimeFormatted, setServerTimeFormatted] = useState("");

  const getTask = useCallback(async () => {
    axios
      .get(await getScriptsServerUrl(`/task/logs?task=${taskID}&after=`))
      .then(
        (response) => {
          response &&
            setTask({
              ...response.data.data,
            });
          setServerTimeFormatted(moment.utc().format("YYYY-MMM-DD HH:mm:ss"));
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  const updateTask = useCallback(async (taskID, newData) => {
    await post(`/task/update?task=${taskID}`, newData);
  }, []);

  const updatePriority = useCallback(async (taskID, newPriority) => {
    console.log("updating priority", taskID, newPriority);
    await post(`/task/priority?task=${taskID}`, { priority: newPriority });
  }, []);

  const refetch = useCallback(() => {
    getTask();
  }, [getTask]);

  useEffect(() => {
    if (taskID) {
      getTask();
    }
  }, [taskID]);

  return (
    <ScheduledTaskContext.Provider
      value={{ task, serverTimeFormatted, updateTask, updatePriority, refetch }}
    >
      {children}
    </ScheduledTaskContext.Provider>
  );
};

export const useScheduledTask = () => useContext(ScheduledTaskContext);
