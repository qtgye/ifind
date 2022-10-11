import React, { useCallback, useEffect, useState } from "react";
import Button, { ButtonProps } from "../Button";
import FontAwesomeIcon from "../FontAwesomeIcon";
import NumberInput, { NumberInputProps } from "../NumberInput";
import {
  useScheduledTask,
  ScheduledTaskProvider,
} from "../../providers/scheduledTaskProvider";

declare interface TaskCountdownProps {
  task: I_RawTask;
}

declare interface CounterViewProps {
  countdown: string;
  onButtonClick: ButtonProps["onClick"];
  isBusy: boolean;
}

declare interface EditViewProps {
  onSave: NumberInputProps["onChange"];
}

const EditView = ({ onSave }: EditViewProps) => {
  const [minutesAdjust, setMinutesAdjust] = useState(0);

  const onChange = useCallback((value) => {
    setMinutesAdjust(value);
  }, []);

  const onClick = useCallback(() => {
    if (typeof onSave === "function") {
      onSave(minutesAdjust);
    }
  }, [onSave, minutesAdjust]);

  return (
    <div className="task-countdown__edit-view">
      <NumberInput
        name="next_run"
        value={minutesAdjust}
        onChange={onChange}
        max={1440 /* One day */}
        min={null}
        size={3}
      />
      minutes
      <Button onClick={onClick} className="task-countdown__apply">
        <FontAwesomeIcon icon={"check"} />
      </Button>
    </div>
  );
};

const CounterView = ({
  countdown,
  onButtonClick,
  isBusy,
}: CounterViewProps) => {
  return (
    <div className="task-countdown__counter-view">
      {countdown}
      <Button
        onClick={onButtonClick}
        color="secondary"
        className="task-countdown__edit"
        title="Increase/decrease countdown"
      >
        <FontAwesomeIcon icon={isBusy ? "spinner" : "pen"} pulse={isBusy} />
      </Button>
    </div>
  );
};

const TaskCountdown = ({ task }: TaskCountdownProps) => {
  const { updateTask } = useScheduledTask();
  const [nextRun, setNextRun] = useState(task.next_run);
  const [isEditting, setIsEditting] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const onUpdate = useCallback(
    (newValue) => {
      setIsEditting(false);

      if (!newValue) {
        return;
      }

      setIsBusy(true);
      updateTask(task.id as string, {
        next_run: (task.next_run || Date.now()) + newValue * 1000 * 60,
      });
    },
    [updateTask, task]
  );

  useEffect(() => {
    if (nextRun !== task.next_run) {
      setNextRun(task.next_run);
      setIsBusy(false);
    }
  }, [task, nextRun]);

  return (
    <div
      className={["task-countdown", isBusy && "task-countdown--busy"]
        .filter(Boolean)
        .join(" ")}
    >
      {isEditting ? (
        <EditView {...task} onSave={onUpdate} />
      ) : (
        <CounterView
          countdown={task.isReady ? "READY" : (task.countdown as string)}
          onButtonClick={() => setIsEditting(true)}
          isBusy={isBusy}
        />
      )}
    </div>
  );
};

export default (props: TaskCountdownProps) => (
  <ScheduledTaskProvider>
    <TaskCountdown {...props} />
  </ScheduledTaskProvider>
);
