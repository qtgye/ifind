import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useRef,
  ComponentProps
} from "react";
import { Header } from "@buffetjs/custom";

import { useScheduledTasksList, ScheduledTasksListProvider } from '../../providers/scheduledTasksListProvider';
import TasksList from '../../components/TasksList';

import "./styles.scss";

const ScheduledTasks = () => {
  const { tasks, startTask, stopTask } = useScheduledTasksList();

  const onTaskAction = useCallback((action, taskID) => {
    console.log({ action, taskID });
    switch ( action ) {
      case 'start':
        startTask(taskID);
        break;
      case 'stop':
        stopTask(taskID);
        break;
    }
  }, [ startTask, stopTask ]);

  return (
    <div className="container scheduled-tasks">
      <Header title={{ label: "Scheduled Tasks" }} />
      <TasksList tasks={tasks} onTaskAction={onTaskAction} />
    </div>
  );
};

export default (props: ComponentProps<any>) => (
  <ScheduledTasksListProvider>
    <ScheduledTasks  {...props} />
  </ScheduledTasksListProvider>
);
