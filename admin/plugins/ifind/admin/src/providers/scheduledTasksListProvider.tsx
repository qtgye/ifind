import React, { useState, useEffect, useCallback, createContext, useContext } from 'react';
import { useWebSocket } from '../helpers/useWebSocket';

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
interface I_TaskList {
  tasks: I_RawTask[]
}

interface T_MessageDataPayload {
  tasks?: I_RawTask[]
}
interface I_MessageData {
  action: string
  payload?: T_MessageDataPayload
}
type T_TaskListActionHandlerCallback = (tasks: I_RawTask[]) => any;

// Context
export const ScheduledTasksListContext = createContext({});

// Provider
export const ScheduledTasksListProvider = ({ children }: I_ComponentProps) => {
  const [ tasks, setTasks ] = useState<I_RawTask[]>([]);
  const [ connected, setConnected ] = useState(false);

  const tasksListActionHandler = useCallback<T_TaskListActionHandlerCallback>((tasks = []) => {
    setTasks(tasks);
  }, []);

  const [ send, socket ] = useWebSocket('/scheduled-tasks', {
    tasks: tasksListActionHandler
  });

  const startTask = useCallback((taskID) => {
    send('start-task', taskID);
  }, [ send ]);

  const stopTask = useCallback((taskID) => {
    send('stop-task', taskID);
  }, [ send ]);

  useEffect(() => {
    if ( socket ) {
      socket.onopen = () => setConnected(true);
      socket.onclose = () => setConnected(false);
    }
  }, [ socket ]);

  return (
    <ScheduledTasksListContext.Provider value={{ tasks, startTask, stopTask, connected }}>
      {children}
    </ScheduledTasksListContext.Provider>
  )
};

export const useScheduledTasksList = () => useContext(ScheduledTasksListContext) as I_ScheduledTasksProviderValue