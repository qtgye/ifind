import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { useParams } from "react-router-dom";
import { useGQLFetch } from "../helpers/gqlFetch";
import axios from 'axios';


const scheduledTaskQuery = `
query GetScheduledTask ( $task: String! ) {
  getTask(id: $task ) {
    name
    logs {
      date_time
      type
      message
    }
    canRun
  }
}
`;

export const ScheduledTaskContext = createContext<ScheduledTaskContextData>({});

export const ScheduledTaskProvider = ({
  children,
}: React.PropsWithChildren<any>) => {
  const gqlFetch = useGQLFetch();
  const { taskID } = useParams<ScheduledTaskRouteParams>();
  const [task, setTask] = useState<Task>();

  // const getTask = useCallback(async () => {
  //   gqlFetch(scheduledTaskQuery, { task: taskID })
  //   .then(({ getTask }) => {
  //     getTask && setTask(getTask);
  //   });
  // }, [taskID, gqlFetch]);

    const getTask = useCallback(async () => {
    // gqlFetch(scheduledTaskQuery, { task: taskID })
    // .then(({ getTask }) => {
    //   getTask && setTask(getTask);
    // });
    let body ={
      taskID : taskID,
    }
    // if (taskID == "ebay-wow-offers") {
      axios.post("https://script.ifindilu.de/task/getTaskLog", body)
      // axios.post("http://localhost:3000/task/getTaskLog", body)
      .then(
        (response) => {
            response && setTask(response.data);
            console.log(response.data)
            // offers.push(response.data)
          
        },
        (error) => {
          console.log(error);
        }
      );
  }, []);

  const refetch = useCallback(() => {
    getTask();
  }, [ getTask ]);

  useEffect(() => {
    if (taskID) {
      getTask();
    }
  }, [taskID]);

  return (
    <ScheduledTaskContext.Provider value={{ task, refetch }}>
      {children}
    </ScheduledTaskContext.Provider>
  );
};

export const useScheduledTask = () => useContext(ScheduledTaskContext);
