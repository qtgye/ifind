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


import "./styles.scss";

const ScheduledTasks = () => {
  const {tasks, startTask,stopTask,serverTimeFormatted, logs,isTaskAdded, limit, parallel, error } =
    useScheduledTasksList();

  const onTaskAction = useCallback(
      
    (action, taskID, index) => {
      console.log("ontaskAction called from container");
      switch (action) {
        case "start":
          startTask && startTask(taskID,index);
          break;
        case "stop":
          stopTask && stopTask(taskID,index);
          break;
      }
    },
    [startTask, stopTask]
  );

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
      {/* Error here */}
      {error ? (
        <div className="scheduled-tasks__error">
          <FontAwesomeIcon icon='exclamation-circle' className='scheduled-tasks__error-icon' />{error}
        </div>
      ): ''}
      <TasksList tasks={isTaskAdded || []} onTaskAction={onTaskAction} limit={limit || ""} parallel={parallel || ""}/>
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
