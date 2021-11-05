import React, { useCallback, useEffect } from "react";
import { Header } from "@buffetjs/custom";

import { useScheduledTask, ScheduledTaskProvider } from '../../providers/scheduledTaskProvider';

import LogsList from "../../components/LogsList";

import "./styles.scss";

export type statusLabelMapType = {
  [key: string]: any;
};

const ScheduledTask = (): JSX.Element => {
  const { task, refetch }: ScheduledTaskContextData =
  useScheduledTask();

  const refetchData = useCallback(() => {
    refetch && refetch();
  }, [refetch]);

  useEffect(() => {
    window.setTimeout(() => refetchData(), 1000);
  }, [task]);

  return (
    <div className="container">
      <div className="row">
        <Header title={{ label: task?.name }} />
        <div className="background-process__logs">
          {task?.logs?.length && <LogsList logs={task.logs} />}
        </div>
      </div>
    </div>
  );
};

interface I_Props {
  [key: string]: any;
}
export default (props: I_Props) => (
  <ScheduledTaskProvider>
    <ScheduledTask {...props} />
  </ScheduledTaskProvider>
);
