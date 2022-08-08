import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@buffetjs/core";
import FontAwesomeIcon from "../FontAwesomeIcon";

const QueueItemActions = ({
  running,
  id,
  canRun,
  onAction,
  busy,
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
      <Button disabled={isDisabled} color={color} onClick={onClick}>
        <FontAwesomeIcon icon={icon} pulse={isBusy} />
      </Button>
    </div>
  );
};

export default QueueItemActions;
