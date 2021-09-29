import React, { useCallback, useState } from "react";
import { ReactNode } from "react";
import { Button } from '@buffetjs/core';

import Table, { T_ColumnHeader, T_GenericRowData } from "../Table";
import FontAwesomeIcon from "../FontAwesomeIcon";

import { I_RawTask } from '../../providers/scheduledTasksListProvider';

import './styles.scss';

export interface I_TasksListProps {
  tasks: I_RawTask[];
};

export type T_TaskList = (props: I_TasksListProps) => JSX.Element;

const TasksList: T_TaskList = ({ tasks }) => {
  const someTaskRuns = tasks.some((task) => /run/i.test(task.status));

  type I_GetTaskActionsCallback = (task: I_RawTask) => JSX.Element;
  const getTaskActions = useCallback<I_GetTaskActionsCallback>((task) => {
    const isRunning = /run/i.test(task.status);
    const isDisabled = someTaskRuns && !isRunning ? true : false;
    const icon = isRunning ? 'stop' : 'play';
    const label = isRunning ? 'Stop' : 'Run';
    const color = isRunning ? 'delete' : 'primary';

    return (
      <Button disabled={isDisabled} color={color}>
        <FontAwesomeIcon icon={icon} /> {label}
      </Button>
    );
  }, [ someTaskRuns ]);

  type I_GetTaskStatusCallback = (task: I_RawTask) => JSX.Element;
  const getTaskStatus = useCallback<I_GetTaskStatusCallback>((task) => {
    const status = (task.status || 'stopped').toUpperCase();
    const state = /run/i.test(status) ? 'running' : 'stopped';

    return (
      <span className={`tasks-list__status tasks-list__status--${state}`}>{status}</span>
    )
  }, []);

  const headers: T_ColumnHeader = {
    status: "Status",
    name: "Task Name",
    frequency: "Frequency",
    next_run: "Next Run Schedule",
    action: "Action",
  };

  const rowsData: T_GenericRowData[] = tasks.map((task) => ({
    status: getTaskStatus(task),
    name: task.name,
    frequency: task.frequency,
    next_run: task.next_run,
    action: getTaskActions(task),
  }));

  return (
    <Table
      className='tasks-list'
      headers={headers}
      rows={rowsData}
    />
  );
};

export default TasksList;
