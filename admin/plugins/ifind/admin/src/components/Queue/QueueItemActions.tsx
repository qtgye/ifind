import React, { useState, useEffect, useCallback } from "react";
import Button from "../Button";
import FontAwesomeIcon from "../FontAwesomeIcon";
import TaskLogsLink from "../TasksListControls/TaskLogsLink";

const QueueItemActions = ({
  running,
  id,
  canRun,
  onAction,
  busy,
  task,
}: QueueItemActionsProps) => {
  const buttonAction = running ? "stop" : "start";
  const color = running ? "delete" : "primary";
  const icon = running ? "stop" : "play";
  const [isBusy, setIsBusy] = useState(busy);
  const [isDisabled, setIsDisabled] = useState(false);

  const onClick = useCallback<React.MouseEventHandler<HTMLButtonElement>>(
    (e) => {
      e.preventDefault();

      if (typeof onAction === "function") {
        setIsBusy(true);
        onAction(buttonAction, id);
      }
    },
    [id, onAction, buttonAction]
  );

  useEffect(() => {
    setIsDisabled(isBusy || (!running && !canRun) ? true : false);
  }, [isBusy, running, canRun]);

  return (
    <div className="queue__actions">
      <Button
        disabled={isDisabled}
        color={color}
        onClick={onClick}
        title={`${buttonAction} action ${task.id}`}
      >
        <FontAwesomeIcon icon={icon} pulse={isBusy} />
      </Button>
      {running ? <TaskLogsLink task={task.id as string} /> : ""}
    </div>
  );
};

export default QueueItemActions;
