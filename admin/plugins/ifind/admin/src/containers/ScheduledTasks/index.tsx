import React, {
  useCallback,
  ComponentProps
} from "react";
import { Header } from "@buffetjs/custom";
import { useHistory } from 'react-router-dom';

import pluginId from '../../pluginId';
import { useScheduledTasksList, ScheduledTasksListProvider } from '../../providers/scheduledTasksListProvider';
import TasksList from '../../components/TasksList';
import FontAwesomeIcon from '../../components/FontAwesomeIcon';

import "./styles.scss";

const ScheduledTasks = () => {
  const { tasks, startTask, stopTask, serverTimeFormatted } = useScheduledTasksList();

  const onTaskAction = useCallback((action, taskID) => {
    switch ( action ) {
      case 'start':
        startTask && startTask(taskID);
        break;
      case 'stop':
        stopTask && stopTask(taskID);
        break;
    }
  }, [ startTask, stopTask ]);

  return (
    <div className="container scheduled-tasks">
      <Header
        title={{ label: "Scheduled Tasks" }}
      />
      <div className="scheduled-tasks__server-time">
        <strong>Server Time: </strong> {serverTimeFormatted} (UTC)
      </div>
      <TasksList tasks={tasks || []} onTaskAction={onTaskAction} />
    </div>
  );
};

export default (props: ComponentProps<any>) => (
  <ScheduledTasksListProvider>
    <ScheduledTasks  {...props} />
  </ScheduledTasksListProvider>
);
