import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useGQLFetch } from '../helpers/gqlFetch';

// Types
export interface I_RawTask {
  id: string
  name: string
  status: string
  frequency: string
  next_run: string
  hasBackgroundProcess: boolean
}
interface I_ScheduledTasksProviderValue {
  tasks: I_RawTask[]
  startTask: (taskId: string) => any
  stopTask: (taskId: string) => any
}
interface I_ComponentProps {
  children: any
}
export interface Task {
  frequency: string
  id: string
  name: string
  next_run: number
  status: string
}

// Context
export const ScheduledTasksListContext = createContext({});

export const tasksListsQuery = `
query {
  scheduledTasksList {
    id
    name
    status
    frequency
    next_run
    hasBackgroundProcess
  }
}
`;

// Provider
export const ScheduledTasksListProvider = ({ children }: I_ComponentProps) => {
  const gqlFetch = useGQLFetch();
  const [ tasks, setTasks ] = useState<I_RawTask[]>([]);
  const [ connected, setConnected ] = useState(false);

  const fetchTasksList = useCallback(() => {
    gqlFetch(tasksListsQuery)
    .then(data => {
      if ( data?.scheduledTasksList ) {
        setTasks(data.scheduledTasksList);
      }
    })
  }, [ tasksListsQuery, gqlFetch ]);

  const triggerTask = useCallback((taskID, action) => {

  }, [ useGQLFetch ]);

  const startTask = useCallback((taskID) => {
    triggerTask(taskID, 'start');
  }, []);

  const stopTask = useCallback((taskID) => {
    triggerTask(taskID, 'stop');
  }, []);

  useEffect(() => {
    fetchTasksList();
  }, []);

  return (
    <ScheduledTasksListContext.Provider value={{ tasks, startTask, stopTask }}>
      {children}
    </ScheduledTasksListContext.Provider>
  )
};

export const useScheduledTasksList = () => useContext(ScheduledTasksListContext) as I_ScheduledTasksProviderValue