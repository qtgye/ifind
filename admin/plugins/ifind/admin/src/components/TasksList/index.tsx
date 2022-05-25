import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@buffetjs/core";

import { generatePluginLink } from "../../helpers/url";

import Table, { T_ColumnHeader, T_GenericRowData } from "../Table";
import FontAwesomeIcon from "../FontAwesomeIcon";
import ButtonLink, { E_ButtonLinkColor } from "../ButtonLink";

import "./styles.scss";

export type I_GetTaskActionsCallback = (
  task: I_RawTask
) => JSX.Element | JSX.Element[];
export type I_GetTaskStatusCallback = (task: I_RawTask) => JSX.Element;

// TaskList Component
const TasksList = ({ tasks, onTaskAction }: TasksListProps) => {
  const [someTaskRuns, setSomeTaskRuns] = useState<boolean>(false);
  const [triggeredTask, setTriggeredTask] = useState<string>("");
  const [triggeredAction, setTriggeredAction] = useState<string>("");

  const onTaskActionClick = useCallback(
    (action, taskID) => {
      if (typeof onTaskAction === "function") {
        setTriggeredAction(action);
        setTriggeredTask(taskID);
        onTaskAction(action, taskID);
      }
    },
    [onTaskAction]
  );

  const getTaskActions = useCallback<I_GetTaskActionsCallback>(
    (task) => {
      console.log("task status in getTaskActions ;", task.status);
      const isRunning = /run/i.test(task.status || "");
      console.log("isrunning in GettaskAction", isRunning);
      const color = isRunning ? "delete" : "primary";
      const buttonAction = isRunning ? "stop" : "start";
      const label = isRunning ? "Stop" : "Run";
      let iconPulse = false;
      let icon = isRunning ? "stop" : "play";
      let isDisabled = someTaskRuns && !isRunning ? true : false;

      if (triggeredTask === task.id) {
        isDisabled = true;
        icon = "spinner";
        iconPulse = true;
      }

      return (
        <div className="tasks-list__actions">
          <Button
            disabled={isDisabled}
            color={color}
            onClick={() => onTaskActionClick(buttonAction, task.id)}
          >
            <FontAwesomeIcon icon={icon} pulse={iconPulse} /> {label}
          </Button>
          <ButtonLink
            routerLink
            href={generatePluginLink(`/scheduled-task/${task.id}`, null, false)}
            color={E_ButtonLinkColor.secondary}
            title="Show Logs"
          >
            <FontAwesomeIcon icon="terminal" />
            <span dangerouslySetInnerHTML={{ __html: `&nbsp;Logs` }} />
          </ButtonLink>
        </div>
      );
    },
    [someTaskRuns, onTaskAction, triggeredTask, triggeredAction]
  );

  const getTaskStatus = useCallback<I_GetTaskStatusCallback>((task) => {
    console.log("task Status : ",task.status);
    const status = (task.status || "stopped").toUpperCase();
    const state = /run/i.test(status) ? "running" : "stopped";

    return (
      <span className={`tasks-list__status tasks-list__status--${state}`}>
        {status}
      </span>
    );
  }, []);

  const formatLastRun = useCallback((lastRunUnix) => {
    if (!lastRunUnix) {
      return "";
    }

    const lastRunTime = moment(lastRunUnix);
    const localTimeFormatted = lastRunTime.format("YYYY-MMM-DD HH:mm:ss");
    const utcTimeFormatted = lastRunTime.utc().format("YYYY-MMM-DD HH:mm:ss");

    return <div>{utcTimeFormatted} (UTC)</div>;
  }, []);

  useEffect(() => {
    setTriggeredAction("");
    setTriggeredTask("");
  }, [someTaskRuns]);

  useEffect(() => {
    setTriggeredTask('');
    setSomeTaskRuns(tasks.some((task) => /run/i.test(task.status)));
    // console.log("/run/i.test(task.status", /run/i.test(task.status));
  }, [tasks]);

  const headers: T_ColumnHeader = {
    status: "Status",
    name: "Task Name",
    frequency: "Frequency",
    last_run: "Last Run (Server Time)",
    countdown: "Countdown",
    action: "Action",
  };

  const rowsData: T_GenericRowData[] = tasks.map((task) => ({
    status: getTaskStatus(task),
    name: task.name,
    frequency: task.frequency,
    last_run: formatLastRun(task.last_run),
    action: task.hasModule ? getTaskActions(task) : "-",
    countdown: task.countdown,
  }));

  return <Table className="tasks-list" headers={headers} rows={rowsData} />;
};

export default TasksList;
