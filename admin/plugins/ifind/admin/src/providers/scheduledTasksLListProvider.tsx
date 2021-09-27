import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useGQLFetch } from '../helpers/gqlFetch';

export interface Task {
  name: string
  status: string
  frequency: string
  next_run: number
}

interface I_ScheduledTasksProviderValue {
  tasks: Task[]
}

interface I_ComponentProps {
  children: any
}

export const ScheduledTasksListContext = createContext({});

const scheduledTasksListQuery = `
query GetTasksList {
  scheduledTasksList {
    name
    status
  }
}
`;

export const ScheduledTasksListProvider = ({ children }: I_ComponentProps) => {
  const [ tasks, setTasks ] = useState([]);
  const gqlFetch = useGQLFetch();

  const getTasks = useCallback(async () => {
    const data = await gqlFetch(scheduledTasksListQuery);
    
    if ( data?.scheduledTasksList ) {
      setTasks(data.scheduledTasksList);
    }
  }, []);

  useEffect(() => {
    getTasks();
  }, []);

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