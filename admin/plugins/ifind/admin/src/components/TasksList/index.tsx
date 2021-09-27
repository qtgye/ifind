import React, { useState } from 'react';
import { ComponentProps, Component } from 'react';

import { Task } from '../../providers/scheduledTasksLListProvider';
import TaskListRow from './row';

interface I_TasksListProps extends ComponentProps<any> {
  tasks: Task[]
}

const TasksList = ({ tasks }: I_TasksListProps) => {
  return (
    <table className="tasks-list">
      <thead>
        <tr>
          <th>Status</th>
          <th>Task Name</th>
          <th>Frequency</th>
          <th>Time To Next Run</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {tasks.map(TaskListRow)}
      </tbody>
    </table>
  )
};

export default TasksList;