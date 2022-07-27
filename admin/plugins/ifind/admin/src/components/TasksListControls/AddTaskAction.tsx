import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@buffetjs/core";
import FontAwesomeIcon from "../FontAwesomeIcon";
import { post } from "../../helpers/scripts-server/request";
import { useScheduledTasksList } from "../../providers/scheduledTasksListProvider";

const AddTaskAction = ({ task }: AddTaskActionProps) => {
  const { full } = useScheduledTasksList();
  const [isDisabled, setIsDisabled] = useState(full || false);
  const [isBusy, setIsBusy] = useState(false);

  const addTask = useCallback(() => {
    setIsBusy(true);

    post("/queue/add", { task })
      .then((data) => {
        console.log(data);
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => setIsBusy(false));
  }, [task]);

  useEffect(() => {
    setIsDisabled(full || false);
  }, [full]);

  return (
    <div className="tasks-list__actions">
      <Button
        color={isDisabled ? "cancel" : "primary"}
        onClick={addTask}
        disabled={isDisabled || isBusy}
      >
        <FontAwesomeIcon icon="play" />
        Add
      </Button>
    </div>
  );
};

export default AddTaskAction;
