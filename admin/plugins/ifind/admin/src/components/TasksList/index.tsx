import moment from 'moment';
import React, { useCallback, useState } from "react";
import { ReactNode } from "react";
import { Button } from '@buffetjs/core';

import Table, { T_ColumnHeader, T_GenericRowData } from "../Table";
import FontAwesomeIcon from "../FontAwesomeIcon";

import { I_RawTask } from '../../providers/scheduledTasksListProvider';

import './styles.scss';

// Types Definitions
export interface I_TasksListProps {
  tasks: I_RawTask[]
  onTaskAction?: (action: string, taskID: string) => any
};
export type T_TaskList = (props: I_TasksListProps) => JSX.Element;
export type I_GetTaskActionsCallback = (task: I_RawTask) => JSX.Element;
export type I_GetTaskStatusCallback = (task: I_RawTask) => JSX.Element;

// TaskList Component
const TasksList: T_TaskList = ({ tasks, onTaskAction }) => {
  const someTaskRuns = tasks.some((task) => /run/i.test(task.status));

  const onTaskActionClick = useCallback((action, taskID) => {
    if ( typeof onTaskAction === 'function' ) {
      onTaskAction(action, taskID);
    }
  }, [ onTaskAction ]);

  const getTaskActions = useCallback<I_GetTaskActionsCallback>((task) => {
    const isRunning = /run/i.test(task.status);
    const isDisabled = someTaskRuns && !isRunning ? true : false;
    const icon = isRunning ? 'stop' : 'play';
    const label = isRunning ? 'Stop' : 'Run';
    const color = isRunning ? 'delete' : 'primary';
    const buttonAction = isRunning ? 'stop' : 'start';

    return (
      <Button
        disabled={isDisabled}
        color={color}
        onClick={() => onTaskActionClick(buttonAction, task.id)}
      >
        <FontAwesomeIcon icon={icon} /> {label}
      </Button>
    );
  }, [ someTaskRuns, onTaskAction ]);

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
    next_run: moment(task.next_run).format('YYYY-MMM-DD hh:MM A'),
    action: task.hasBackgroundProcess ? getTaskActions(task) : '-',
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
