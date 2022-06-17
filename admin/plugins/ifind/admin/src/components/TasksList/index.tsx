import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@buffetjs/core";
import { generatePluginLink } from "../../helpers/url";
import Table, { T_ColumnHeader, T_GenericRowData } from "../Table";
import Limit from "../Limit";
import Parallel from "../Parallel";
import axios from 'axios';
import FontAwesomeIcon from "../FontAwesomeIcon";
import ButtonLink, { E_ButtonLinkColor } from "../ButtonLink";
import "./styles.scss";
export type I_GetTaskActionsCallback = (
  task: I_RawTask
) => JSX.Element | JSX.Element[];
export type I_GetTaskStatusCallback = (task: I_RawTask) => JSX.Element;
// TaskList Component
const TasksList = ({ tasks, onTaskAction, limit, parallel}: TasksListProps) => {
  const [someTaskRuns, setSomeTaskRuns] = useState<boolean>(false);
  const [triggeredTask, setTriggeredTask] = useState<string>("");
  const [triggeredAction, setTriggeredAction] = useState<string>("");
  // const onTaskActionClick = useCallback(
  //   (action, taskID) => {
  //     if (typeof onTaskAction === "function") {
  //       setTriggeredAction(action);
  //       setTriggeredTask(taskID);
  //       onTaskAction(action, taskID);
  //     }
  //   },
  //   [onTaskAction]
  // );

  const onTaskActionRun = useCallback(
    (taskID,index) => {
      const action = "start"
      if (typeof onTaskAction === "function") {
        setTriggeredAction(action);
        setTriggeredTask(taskID);
        onTaskAction(action,taskID,index);
      }
    },
    [onTaskAction]
  );

  const onTaskActionStop = useCallback(
    (taskID,index) => {
      const action = "stop"
      if (typeof onTaskAction === "function") {
        setTriggeredAction(action);
        setTriggeredTask(taskID);
        onTaskAction(action,taskID,index);
      }
    },
    [onTaskAction]
  );

  const onClickUp = (index) => {
    console.log("Minutes set---->", index);
    let body = {
      position:index,
      action:"up"
    }
    axios.post('https://script.ifindilu.de/update/position', body)
      .then((response) => {
        console.log("response -->", response.data);
      },
        (error) => {
          console.log(error)
        })

  }

  const onClickDown = (index) => {
    console.log("Minutes set---->", index);
    let body = {
      position: index,
      action:"down"
    }
    axios.post('https://script.ifindilu.de/update/position', body)
      .then((response) => {
        console.log("response -->", response.data);
      },
        (error) => {
          console.log(error)
        })

  }

  const getTaskActions = useCallback<I_GetTaskActionsCallback>(
    (task,index) => {
      console.log("task status in getTaskActions ;", task.status);
      const isRunning = /run/i.test(task.status || "");
      console.log("isrunning in GettaskAction", isRunning);
      const color = isRunning ? "delete" : "primary";
      const buttonAction = isRunning ? "stop" : "start";
      const label = "Start";
      const label2 = "Stop";
      let iconPulse = false;
      let icon = isRunning ? "stop" : "play";
      let isDisabled = isRunning ? true : false;
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
            onClick={() => onTaskActionRun(task.id,index)}
          >
            <FontAwesomeIcon icon="Run" pulse={iconPulse} />{label}
          </Button>
          <Button
            color="delete"
            onClick={() => onTaskActionStop(task.id,index)}
          >
            <FontAwesomeIcon icon="stop" pulse={iconPulse} />{label2}
          </Button>
         
        </div>
      );
    },
    [someTaskRuns, onTaskAction, triggeredTask, triggeredAction]
  );

  const getOrderActions = useCallback<I_GetTaskActionsCallback>(
    (index) => {
      // console.log("task status in getTaskActions ;", task.status);
      // const isRunning = /run/i.test(task.status || "");
      // console.log("isrunning in GettaskAction", isRunning);
      // const color = isRunning ? "delete" : "primary";
      // const buttonAction = isRunning ? "stop" : "start";
      // const label = isRunning ? "Stop" : "Run";
      let iconPulse = false;
      // let icon = isRunning ? "stop" : "play";
      // let isDisabled = someTaskRuns && !isRunning ? true : false;
      // if (triggeredTask === task.id) {
      //   isDisabled = true;
      //   icon = "spinner";
      //   iconPulse = true;
      // }
      return (
        <div className="tasks-list__actions">
          {/* <Button
            // disabled={isDisabled}
            color="secondary"
            onClick={() => onClickUp(index)}
          > */}
          <FontAwesomeIcon icon="arrow-alt-circle-up" onClick={() => onClickUp(index)} /> 
          {/* </Button> */}
          {/* <Button
            // disabled={isDisabled}
            color="secondary"
            onClick={() => onClickDown(index)}
          > */}
            <FontAwesomeIcon icon="arrow-alt-circle-down" onClick={() => onClickDown(index)} />
          {/* </Button> */}
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
    position: "Position",
    name: "Task Name",
    status: "Status",
    last_run: "Last Run (Server Time)",
    // countdown: "Countdown",
    action: "Action",
    order:"Order"
  };
  const rowsData: T_GenericRowData[] = tasks.map((task,index) => 
  index == 0 ?
  ({
    status: getTaskStatus(task),
    position: (index+1),
    name: task.name,
    frequency: task.frequency,
    last_run: formatLastRun(task.last_run),
    action: task.hasModule ? getTaskActions(task,index) : "-",
    // countdown: task.countdown,
    order: "",
  })
  :
  ({
    status: getTaskStatus(task),
    position: (index+1),
    name: task.name,
    frequency: task.frequency,
    last_run: formatLastRun(task.last_run),
    action: task.hasModule ? getTaskActions(task,index) : "-",
    // countdown: task.countdown,
    order:  getOrderActions(index),
  })  
  );
  return (
    <>
    <Parallel parallel = { parallel || ""}/><br></br>
    <Limit limit = { limit || ""}/><br></br>
    <Table className="tasks-list" headers={headers} rows={rowsData} />
    </>
  )
};
export default TasksList;