import React, { useCallback, useEffect, useState } from "react";
import Button, { ButtonProps } from "../Button";
import FontAwesomeIcon from "../FontAwesomeIcon";
import NumberInput, { NumberInputProps } from "../NumberInput";
import {
  useScheduledTask,
  ScheduledTaskProvider,
} from "../../providers/scheduledTaskProvider";

declare interface TaskPriorityProps {
  task: I_RawTask;
  max: number;
  onEditView: (id: string) => void;
  enabled: boolean;
}

declare interface PriorityViewProps {
  priority: number;
  onButtonClick: ButtonProps["onClick"];
  isBusy: boolean;
}

declare interface EditViewProps {
  onSave: NumberInputProps["onChange"];
  onCancel: () => void;
  max: number;
  priority: number;
}

const EditView = ({ onSave, onCancel, max, priority }: EditViewProps) => {
  const [prio, setPrio] = useState(priority);

  const onChange = useCallback((value) => {
    setPrio(value);
  }, []);

  const onClick = useCallback(() => {
    if (typeof onSave === "function") {
      onSave(prio);
    }
  }, [onSave, prio]);

  const _onCancel = useCallback(() => {
    if (typeof onCancel === "function") {
      onCancel();
    }
  }, [onCancel]);

  return (
    <div className="task-priority__edit-view">
      <NumberInput
        name="next_run"
        value={prio}
        onChange={onChange}
        max={max}
        min={1}
        size={3}
      />
    </div>
  );
};

const PriorityView = ({
  priority,
  onButtonClick,
  isBusy,
}: PriorityViewProps) => {
  return (
    <div className="task-priority__counter-view">
      {priority}
      {/* <Button
        onClick={onButtonClick}
        color="secondary"
        className="task-priority__edit"
        title="Adjust priority"
      >
        <FontAwesomeIcon icon={isBusy ? "spinner" : "pen"} pulse={isBusy} />
      </Button> */}
    </div>
  );
};

const TaskPriority = ({
  task,
  max,
  onEditView,
  enabled,
}: TaskPriorityProps) => {
  const { updatePriority } = useScheduledTask();
  const [priority, setPriority] = useState(task.priority);
  const [isEditting, setIsEditting] = useState(false);
  const [isBusy, setIsBusy] = useState(false);

  const onUpdate = useCallback(
    (newValue) => {
      setIsEditting(false);

      if (!newValue || newValue === priority) {
        return;
      }

      if (typeof updatePriority !== "function") {
        return;
      }

      setIsBusy(true);
      updatePriority(task.id as string, newValue as number);
    },
    [updatePriority, task]
  );

  const onCancel = useCallback(() => {
    setIsEditting(false);

    if (typeof onEditView === "function") {
      onEditView("");
    }
  }, [onEditView]);

  const onEditClick = useCallback(() => {
    setIsEditting(true);

    if (typeof onEditView === "function") {
      onEditView(task.id as string);
    }
  }, [onEditView, task]);

  useEffect(() => {
    if (priority !== task.priority && typeof onEditView === "function") {
      setPriority(task.priority);
      setIsBusy(false);
      onEditView("");
    }
  }, [task, priority, onEditView]);

  return (
    <div
      className={[
        "task-priority",
        isBusy && "task-priority--busy",
        !enabled && "task-priority--disabled",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {isEditting ? (
        <EditView
          {...task}
          onSave={onUpdate}
          onCancel={onCancel}
          max={max}
          priority={priority as number}
        />
      ) : (
        <PriorityView
          priority={task.priority as number}
          onButtonClick={onEditClick}
          isBusy={isBusy}
        />
      )}
    </div>
  );
};

export default (props: TaskPriorityProps) => (
  <ScheduledTaskProvider>
    <TaskPriority {...props} />
  </ScheduledTaskProvider>
);
