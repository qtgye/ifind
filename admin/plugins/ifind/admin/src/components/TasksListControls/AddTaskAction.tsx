import React, { useCallback, useEffect, useState } from "react";
import Button from "../Button";
import FontAwesomeIcon from "../FontAwesomeIcon";
import { post } from "../../helpers/scripts-server/request";
import { useScheduledTasksList } from "../../providers/scheduledTasksListProvider";

const AddTaskAction = ({ task }: AddTaskActionProps) => {
  const { full } = useScheduledTasksList();
  const [isDisabled, setIsDisabled] = useState(full || !task.canQueue || false);
  const [isBusy, setIsBusy] = useState(false);

  const addTask = useCallback(() => {
    setIsBusy(true);

    post("/queue/add", { task: task.id })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsBusy(false));
  }, [task]);

  useEffect(() => {
    setIsDisabled(full || !task.canQueue || false);
  }, [full, task]);

  return (
    <div className="tasks-list__actions">
      <Button
        color={isDisabled ? "cancel" : "primary"}
        onClick={addTask}
        disabled={isDisabled || isBusy}
        title='Add to queue'
      >
        <FontAwesomeIcon icon="plus" />
      </Button>
    </div>
  );
};

export default AddTaskAction;
