import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@buffetjs/core";

import { generatePluginLink } from "../../helpers/url";

import TableControls, { T_ColumnHeader, T_GenericRowData } from "../TableControls";
import FontAwesomeIcon from "../FontAwesomeIcon";
import ButtonLink, { E_ButtonLinkColor } from "../ButtonLink";
import axios from 'axios';
import "./styles.scss";
let value = 0

export type I_GetTaskActionsCallback = (
  task: I_RawTask
) => JSX.Element | JSX.Element[];
export type I_GetTaskStatusCallback = (task: I_RawTask) => JSX.Element;

// TaskList Component
const TasksList = ({ tasks, onTaskAction }: TasksListProps) => {
  const [someTaskRuns, setSomeTaskRuns] = useState<boolean>(false);
  const [triggeredTask, setTriggeredTask] = useState<string>("");
  const [triggeredAction, setTriggeredAction] = useState<string>("");
  // const [value, setValue] = useState<number>(0);
  
  // This function is called when the input changes
  const inputHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("sardeep function")
    value = event.target.value;
  };


  const setTextfield = (task,value) => {
    console.log("Minutes set---->", value);
    const taskID = task.id
    let body = {
      minutes: value,
      taskID: taskID
    }
    axios.post('https://script.ifindilu.de/update/countdown', body)
      .then((response) => {
        console.log("response -->", response.data);
      },
        (error) => {
          console.log(error)
        })

  }

  console.log("value---->",value);
  const onTaskActionClick = useCallback(
    (action, taskID) => {
      // if (typeof onTaskAction === "function") {
      //   setTriggeredAction(action);
      //   setTriggeredTask(taskID);
      //   onTaskAction(action, taskID);
      // }
      let body = {
        taskID: taskID,
      }
      // if (taskID == "ebay-wow-offers") {
      // axios.post("https://script.ifindilu.de/task/getTaskLog", body)
      axios.post("https://script.ifindilu.de/task/addTask", body)
        .then(
          (response) => {
            console.log(response.data)
            // offers.push(response.data)

          },
          (error) => {
            console.log(error);
          }
        );
    },
    []
  );

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
          {/* <Button
            disabled={isDisabled}
            color={color}
            onClick={() => onTaskActionClick(buttonAction, task.id)}
          >
            <FontAwesomeIcon icon={icon} pulse={iconPulse} /> {label}
          </Button> */}
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
              display: 'inline-block',
              width: '40%'
            }}
          />
          <Button
            // disabled={isDisabled}
            color={color}
            // onClick={() => setTextfield(taskId)}
            onClick={() => setTextfield(task,value)}
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
      const isRunning = /run/i.test(task.status || "");
      // const color = isRunning ? "delete" : "primary";
      const color = "primary";
      const buttonAction = isRunning ? "stop" : "start";
      const label = "ADD QUEUE"
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
            <FontAwesomeIcon icon={icon} pulse={iconPulse} />{label}
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
    setTriggeredTask('');
    setSomeTaskRuns(tasks.some((task) => /run/i.test(task.status)));
  }, [tasks]);

  const headers: T_ColumnHeader = {
    status: "Id",
    name: "Tasks",
    last_run: "Join the Queue",
    frequency: "Frequency",
    // priority: "Priority",
    countdown: "Countdown",
    updateTime: "Update Countdown Time",
    action: "Logs",
    affiliate: "Affiliate ID",
  };

  const rowsData: T_GenericRowData[] = tasks.map((task, index) => ({
    // status: getTaskStatus(task),
    status: (index + 1),
    name: task.name,
    last_run: task.hasModule ? getQueueActions(task) : "-",
    frequency: task.frequency,
    priority: "",
    action: task.hasModule ? getTaskActions(task) : "-",
    countdown: task.countdown,
    updateTime: task.hasModule ? getUpdateTimeActions(task) : "-",
    affiliate: task.id

  }));

  return <TableControls className="tasks-list" headers={headers} rows={rowsData} />;
};

export default TasksList;
