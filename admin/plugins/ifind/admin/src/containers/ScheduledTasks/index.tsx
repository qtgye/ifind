import React, { useCallback, ComponentProps, useEffect, useState } from "react";
import { Header } from "@buffetjs/custom";
import { useHistory } from "react-router-dom";

import pluginId from "../../pluginId";
import {
  useScheduledTasksList,
  ScheduledTasksListProvider,
} from "../../providers/scheduledTasksListProvider";
import TasksList from "../../components/TasksList";
import TasksControl from "../../components/TasksListControls";
import FontAwesomeIcon from "../../components/FontAwesomeIcon";
import LogsList from "../../components/LogsList";
import axios from 'axios';


import "./styles.scss";

const ScheduledTasks = () => {
  const history = useHistory();
  const {tasks, startTask,stopTask,serverTimeFormatted, logs,isTaskAdded, limit } =
    useScheduledTasksList();

  // const [task/s,setTasks] = useState(null) 
  

  // useEffect(() => {
  //   axios.post("https://script.ifindilu.de/task/getTaskList").then(
  //     (response) => {
  //       setTasks(response.data.tasks);
  //       // offers.push(response.data)
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // },[]);

  const onTaskAction = useCallback(
      
    (action, taskID) => {
      console.log("ontaskAction called from container");
      switch (action) {
        case "start":
          startTask && startTask(taskID);
          break;
        case "stop":
          stopTask && stopTask(taskID);
          break;
      }
    },
    [startTask, stopTask]
  );

  // return (
  //   <div className="container scheduled-tasks">
  //     <Header
  //       title={{ label: "Scheduled Tasks" }}
  //       actions={[
  //         {
  //           Component: () => (
  //             <div className="scheduled-tasks__server-time">
  //               <strong>Server Time:&nbsp;</strong> {serverTimeFormatted} (UTC)
  //             </div>
  //           ),
  //         },
  //       ]}
  //     />
  //     <TasksList tasks={tasks || []} onTaskAction={onTaskAction} />
  //     <div className="scheduled-tasks__logs">
  //       <LogsList logs={logs || []} title="Runner Logs" />
  //     </div>
  //   </div>
  // );
  // console.log("Inside scheduled Task container ");
  // console.log("Value of tasks :", tasks);
  return(<div>
     <div className="container scheduled-tasks">
       <Header
        title={{ label: "Execution Queue" }}
        actions={[
          {
            Component: () => (
              <div className="scheduled-tasks__server-time">
                <strong>Server Time:&nbsp;</strong> {serverTimeFormatted} (UTC)
              </div>
            ),
          },
        ]}
      />
      <TasksList tasks={isTaskAdded || []} onTaskAction={onTaskAction} limit={limit || ""}/>
     {/* <div className="scheduled-tasks__logs">
      <LogsList logs={logs || []} title="Runner Logs" />
      </div> */}
     </div>
     <div className="container scheduled-tasks">
       <Header
        title={{ label: "Task Controls" }}
        actions={[
          {
            Component: () => (
              <></>
              // <div className="scheduled-tasks__server-time">
              //   <strong>Server Time:&nbsp;</strong> {serverTimeFormatted} (UTC)
              // </div>
            ),
          },
        ]}
      />
      <TasksControl tasks={tasks || []} />
     <div className="scheduled-tasks__logs">
      <LogsList logs={logs || []} title="Runner Logs" />
      </div>
     </div>
  </div>)
};

export default (props: ComponentProps<any>) => (
  <ScheduledTasksListProvider>
    <ScheduledTasks {...props} />
  </ScheduledTasksListProvider>
);
