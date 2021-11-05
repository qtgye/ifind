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
import LogsList from '../../components/LogsList';

import "./styles.scss";

const ScheduledTasks = () => {
  const history = useHistory();
  const { tasks, startTask, stopTask, serverTimeFormatted, logs } = useScheduledTasksList();

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
        actions={[
          {
            label: 'Runner Logs',
            onClick: () => history.push(`/plugins/${pluginId}/background-process/scheduled-tasks`),
            color: 'secondary',
            type: 'button',
            icon: <FontAwesomeIcon icon="terminal" />
          },
        ]}
      />
      <div className="scheduled-tasks__server-time">
        <strong>Server Time:&nbsp;</strong> {serverTimeFormatted} (UTC)
      </div>
      <TasksList tasks={tasks || []} onTaskAction={onTaskAction} />
      <div className="scheduled-tasks__logs">
        <LogsList logs={logs || []} title="Runner Logs" />
      </div>
    </div>
  );
};

export default (props: ComponentProps<any>) => (
  <ScheduledTasksListProvider>
    <ScheduledTasks  {...props} />
  </ScheduledTasksListProvider>
);
