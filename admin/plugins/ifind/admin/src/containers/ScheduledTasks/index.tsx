import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useRef,
  ComponentProps
} from "react";
import { Header } from "@buffetjs/custom";

import FontAwesomeIcon from "../../components/FontAwesomeIcon";
import { useScheduledTasksList, ScheduledTasksListProvider } from '../../providers/scheduledTasksLListProvider';
import TasksList from '../../components/TasksList'

import "./styles.scss";

const ScheduledTasks = () => {
  const { tasks } = useScheduledTasksList();

  return (
    <div className="container scheduled-tasks">
      <Header title={{ label: "Scheduled Tasks" }} />
      <TasksList tasks={tasks} />
    </div>
  );
};

export default (props: ComponentProps<any>) => (
  <ScheduledTasksListProvider>
    <ScheduledTasks  {...props} />
  </ScheduledTasksListProvider>
);
