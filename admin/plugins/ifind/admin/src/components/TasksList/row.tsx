import React, { useState } from 'react';

import { Task } from '../../providers/scheduledTasksLListProvider';

const TaskListRow = ({ name, status, frequency, next_run }: Task) => {
  return (
    <tr className="task-list-row">
      <td>{status}</td>
      <td>{name}</td>
      <td>{frequency}</td>
      <td>{next_run}</td>
    </tr>
  )
};

export default TaskListRow;