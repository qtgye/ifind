import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@buffetjs/core";
import axios from "axios";

import { generatePluginLink } from "../../helpers/url";
import TableControls, {
  T_ColumnHeader,
  T_GenericRowData,
} from "../TableControls";
import FontAwesomeIcon from "../FontAwesomeIcon";
import ButtonLink, { E_ButtonLinkColor } from "../ButtonLink";
import { useScriptsServerUrl } from "../../providers/scheduledTasksListProvider";

import AddTaskAction from './AddTaskAction';

import "./styles.scss";
let value: number = 0;
let priorityValue: number = 0;
export type I_GetTaskActionsCallback = (
  task: I_RawTask
) => JSX.Element | JSX.Element[];
export type I_GetTaskStatusCallback = (task: I_RawTask) => JSX.Element;
// TaskList Component
const TasksList = ({ tasks, onTaskAction }: TasksListProps) => {
  const getScriptsServerUrl = useScriptsServerUrl();
  const [someTaskRuns, setSomeTaskRuns] = useState<boolean>(false);
  const [triggeredTask, setTriggeredTask] = useState<string>("");
  const [triggeredAction, setTriggeredAction] = useState<string>("");
  const [rows, setRows] = useState<T_GenericRowData[]>([]);
  // const [value, setValue] = useState<number>(0);
  // This function is called when the input changes
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("sardeep function");
    if (parseInt(event.target.value) < 0) event.target.value = "0  ";
    value = parseInt(event.target.value);
  };

  const inputHandler2 = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("sardeep function");
    if (event.target.value > 10) {
      event.target.value = "10";
      priorityValue = parseInt(event.target.value);
    }
  };

  const priorityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Inside priority change handlers");
    if (parseInt(e.target.value) > 10) e.target.value = "10";
    if (parseInt(e.target.value) < 1) e.target.value = "1";
    priorityValue = parseInt(e.target.value);
  };

  const setTextfield = async (task, value) => {
    console.log("Minutes set---->", value);
    const taskID = task.id;
    let body = {
      minutes: value,
      taskID: taskID,
    };
    axios.post(await getScriptsServerUrl("/update/countdown"), body).then(
      (response) => {
        console.log("response -->", response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  };
  const setPriority = async (task, priorityValue) => {
    console.log("Minutes set---->", priorityValue);
    const taskID = task.id;
    let body = {
      priority: priorityValue,
      taskID: taskID,
    };
    axios.post(await getScriptsServerUrl("/update/priority"), body).then(
      (response) => {
        console.log("response -->", response.data);
      },
      (error) => {
        console.log(error);
      }
    );
    priorityValue = "";
  };

  const onTaskActionClick = useCallback(async (action, taskID) => {
    let body = {
      taskID: taskID,
    };

    switch (action) {
      case "start":
        
        break;
    }
  }, []);
  const getTaskActions = useCallback<I_GetTaskActionsCallback>(
    (task) => {
      const isRunning = /run/i.test(task.status || "");
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
  const getUpdateTimeActions = useCallback<I_GetTaskActionsCallback>(
    (task) => {
      return <span>( WIP )</span>

      // const isRunning = /run/i.test(task.status || "");
      const color = "primary";
      // const buttonAction = isRunning ? "stop" : "start";
      // let iconPulse = false;
      // let icon = isRunning ? "stop" : "play";
      // let isDisabled = someTaskRuns && !isRunning ? true : false;
      // if (triggeredTask === task.id) {
      //   isDisabled = true;
      //   icon = "spinner";
      //   iconPulse = true;
      // }
      return (
        <div className="tasks-list__actions">
          {/* <ButtonLink
            routerLink
            href={generatePluginLink(`/scheduled-task/${task.id}`, null, false)}
            color={E_ButtonLinkColor.secondary}
            title="Show Logs"
          >
            <FontAwesomeIcon icon="terminal" />
            <span dangerouslySetInnerHTML={{ __html: `&nbsp;Logs` }} />
          </ButtonLink> */}
          <input
            // className={hello}
            name="input"
            onInput={inputHandler}
            placeholder="Add Minute"
            type="number"
            max={50}
            // value={formatLastRun.value}
            style={{
              display: "inline-block",
              width: "30%",
            }}
          />
          <Button
            // disabled={isDisabled}
            color={color}
            // onClick={() => setTextfield(taskId)}
            onClick={() => setTextfield(task, value)}
          >
            Update
          </Button>
        </div>
      );
    },
    [someTaskRuns, onTaskAction, triggeredTask, triggeredAction]
  );
  const getUpdatePriority = useCallback<I_GetTaskActionsCallback>(
    (task) => {
      return <span>( WIP )</span>
      // const isRunning = /run/i.test(task.status || "");
      const color = "primary";
      // const buttonAction = isRunning ? "stop" : "start";
      // let iconPulse = false;
      // let icon = isRunning ? "stop" : "play";
      // let isDisabled = someTaskRuns && !isRunning ? true : false;
      // if (triggeredTask === task.id) {
      //   isDisabled = true;
      //   icon = "spinner";
      //   iconPulse = true;
      // }
      return (
        <div className="tasks-list__actions">
          {/* <ButtonLink
            routerLink
            href={generatePluginLink(`/scheduled-task/${task.id}`, null, false)}
            color={E_ButtonLinkColor.secondary}
            title="Show Logs"
          >
            <FontAwesomeIcon icon="terminal" />
            <span dangerouslySetInnerHTML={{ __html: `&nbsp;Logs` }} />
          </ButtonLink> */}
          <input
            // className={hello}
            // onChange={({ target: { value } }) => {
            //   if(value>50)
            //   {value = 50;}
            //   setLimit(value);
            // }}
            name="input"
            // onInput={inputHandler2}
            onChange={priorityChange}
            placeholder="Add Minute"
            type="number"
            max={10}
            // value={formatLastRun.value}
            style={{
              display: "inline-block",
              width: "30%",
            }}
          />
          <Button
            // disabled={isDisabled}
            color={color}
            // onClick={() => setTextfield(taskId)}
            onClick={() => setPriority(task, priorityValue)}
          >
            Update
          </Button>
        </div>
      );
    },
    [someTaskRuns, onTaskAction, triggeredTask, triggeredAction]
  );
  const getQueueActions = useCallback<I_GetTaskActionsCallback>(
    (task) => {
      return <span>( WIP )</span>;


      const isRunning = /run/i.test(task.status || "");
      // const color = isRunning ? "delete" : "primary";
      const color = "primary";
      const buttonAction = isRunning ? "stop" : "start";
      const label = "ADD";
      let iconPulse = false;
      // let icon = isRunning ? "stop" : "play";
      let icon = "play";
      // let isDisabled = someTaskRuns && !isRunning ? true : false;
      // if (triggeredTask === task.id) {
      //   isDisabled = true;
      //   icon = "spinner";
      //   iconPulse = true;
      // }
      return (
        <div className="tasks-list__actions">
          <Button
            // disabled={isDisabled}
            color={color}
            onClick={() => onTaskActionClick(buttonAction, task.id)}
          >
            <FontAwesomeIcon icon={icon} pulse={iconPulse} />
            {label}
          </Button>
          {/* <ButtonLink
            routerLink
            href={generatePluginLink(`/scheduled-task/${task.id}`, null, false)}
            color={E_ButtonLinkColor.secondary}
            title="Show Logs"
          >
            <FontAwesomeIcon icon="terminal" />
            <span dangerouslySetInnerHTML={{ __html: `&nbsp;Logs` }} />
          </ButtonLink> */}
        </div>
      );
    },
    [someTaskRuns, onTaskAction, triggeredTask, triggeredAction]
  );
  const getTaskStatus = useCallback<I_GetTaskStatusCallback>((task) => {
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
    setTriggeredTask("");
    setSomeTaskRuns(tasks.some((task) => /run/i.test(task.status)));
  }, [tasks]);

  useEffect(() => {
    const rowsData: T_GenericRowData[] = tasks.map((task, index) => ({
      status: index + 1,
      name: task.name,
      joinQueue: <AddTaskAction task={task.id || ''} />,
      frequency: task.frequency ||  "-",
      priority: task.priority,
      action: task.hasModule ? getTaskActions(task) : "-",
      countdown:
        task.isReady
          ? 'READY'
          : task.countdown,
      updateTime: task.hasModule ? getUpdateTimeActions(task) : "-",
      updatePriority: task.hasModule ? getUpdatePriority(task) : "-",
      last_run: formatLastRun(task.last_run),
    }));

    setRows(rowsData);
  }, [tasks]);

  const headers: T_ColumnHeader = {
    status: "Id",
    name: "Tasks",
    joinQueue: "Queue Actions",
    frequency: "Frequency",
    countdown: "Countdown",
    updateTime: "Update Countdown",
    priority: "Priority",
    updatePriority: "Update Priority",
    action: "Logs",
    last_run: "Last Run",
  };

  return (
    <TableControls className="tasks-list" headers={headers} rows={rows} />
  );
};
export default TasksList;
