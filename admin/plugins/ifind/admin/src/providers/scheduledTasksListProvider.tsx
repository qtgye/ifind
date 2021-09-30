import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';

import { useWebSocket } from '../helpers/useWebSocket';

export interface I_RawTask {
  name: string
  status: string
  frequency: string
  next_run: string
}

interface I_ScheduledTasksProviderValue {
  tasks: I_RawTask[]
}

interface I_ComponentProps {
  children: any
}

export const ScheduledTasksListContext = createContext({});

export interface Task {
  frequency: string
  id: string
  name: string
  next_run: number
  status: string
}

export const ScheduledTasksListProvider = ({ children }: I_ComponentProps) => {
  const [ tasks, setTasks ] = useState<I_RawTask[]>([]);

  interface I_TaskList {
    tasks: I_RawTask[]
  }

  type T_MessageEventData = I_TaskList|string;

  interface TasksListMessage {
    tasks: I_RawTask[]
    event?: string
    data?: T_MessageEventData
  }

  const onEvent = useCallback((event: string, data?: T_MessageEventData) => {
    console.log({ event, data });
  }, []);

  type T_OnWSMessage = (wsData: TasksListMessage) => any;
  const onWSMessage = useCallback<T_OnWSMessage>((wsData) => {
    if ( Array.isArray(wsData?.tasks) ) {
      setTasks(wsData.tasks);
    }

    if ( wsData.event ) {
      onEvent(wsData.event, wsData.data);
    }
  }, [ onEvent ]);

  const [ send ] = useWebSocket('/scheduled-tasks', onWSMessage);

  return (
    <ScheduledTasksListContext.Provider value={
      {
        tasks: tasks
      } as I_ScheduledTasksProviderValue
    }>
      {children}
    </ScheduledTasksListContext.Provider>
  )
};

export const useScheduledTasksList = () => useContext(ScheduledTasksListContext) as I_ScheduledTasksProviderValue