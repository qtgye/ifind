import moment from "moment";
import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";

import { post } from "../../helpers/scripts-server/request";
import Table, { T_ColumnHeader, T_GenericRowData } from "../Table";
import FontAwesomeIcon from "../FontAwesomeIcon";
import QueueItemActions from "./QueueItemActions";

import "./styles.scss";

// TaskList Component
const Queue = ({ onQueueItemAction, items }: QueueProps) => {
  // const onTaskActionRun = useCallback(
  //   (taskID, index) => {
  //     const action = "start";
  //     if (typeof onTaskAction === "function") {
  //       setTriggeredAction(action);
  //       setTriggeredTask(taskID);
  //       onTaskAction(action, taskID, index);
  //     }
  //   },
  //   [onTaskAction]
  // );

  // const onTaskActionStop = useCallback(
  //   (taskID, index) => {
  //     const action = "stop";
  //     if (typeof onTaskAction === "function") {
  //       setTriggeredAction(action);
  //       setTriggeredTask(taskID);
  //       onTaskAction(action, taskID, index);
  //     }
  //   },
  //   [onTaskAction]
  // );

  const onClickUp = useCallback((index) => {
    // console.log("Minutes set---->", index);
    let body = {
      position: index,
      action: "up",
    };
    axios.post("https://script.ifindilu.de/update/position", body).then(
      (response) => {
        console.log("response -->", response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const onClickDown = useCallback((index) => {
    // console.log("Minutes set---->", index);
    let body = {
      position: index,
      action: "down",
    };
    axios.post("https://script.ifindilu.de/update/position", body).then(
      (response) => {
        // console.log("response -->", response.data);
      },
      (error) => {
        console.log(error);
      }
    );
  }, []);

  const getOrderActions = useCallback(
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
        <div className="queue__actions">
          {/* <Button
            // disabled={isDisabled}
            color="secondary"
            onClick={() => onClickUp(index)}
          > */}
          <FontAwesomeIcon
            icon="arrow-alt-circle-up"
            onClick={() => onClickUp(index)}
          />
          {/* </Button> */}
          {/* <Button
            // disabled={isDisabled}
            color="secondary"
            onClick={() => onClickDown(index)}
          > */}
          <FontAwesomeIcon
            icon="arrow-alt-circle-down"
            onClick={() => onClickDown(index)}
          />
          {/* </Button> */}
        </div>
      );
    },
    [
      // someTaskRuns, onTaskAction, triggeredTask, triggeredAction
    ]
  );
  const getTaskStatus = useCallback((task) => {
    // console.log("task Status : ",task.status);
    const status = (task.status || "stopped").toUpperCase();
    const state = /run/i.test(status) ? "running" : "stopped";
    return (
      <span className={`queue__status queue__status--${state}`}>{status}</span>
    );
  }, []);

  const formatStatus = useCallback((isRunning) => {
    const state = isRunning ? "running" : "stopped";

    return (
      <span className={`queue__status queue__status--${state}`}>{state}</span>
    );
  }, []);

  const formatLastRun = useCallback((lastRunUnix) => {
    if (!lastRunUnix) {
      return "";
    }
    const lastRunTime = moment(lastRunUnix);
    const utcTimeFormatted = lastRunTime.utc().format("YYYY-MMM-DD HH:mm:ss");
    return <div>{utcTimeFormatted} (UTC)</div>;
  }, []);

  const onAction = useCallback((actionType: "start" | "stop", item: string) => {
    post(`/queue/${actionType}`, { item });
  }, []);

  const [rows, setRows] = useState<T_GenericRowData[]>([]);

  useEffect(() => {
    const rowsData: T_GenericRowData[] = items.map((item, index) => ({
      key: item.id,
      id: item.id,
      status: formatStatus(item.running),
      position: index + 1,
      name: item.task.name,
      frequency: item.task.frequency,
      last_run: formatLastRun(item.task.last_run),
      action: <QueueItemActions {...item} onAction={onAction} />,
      order: "",
    }));

    setRows(rowsData);
  }, [items]);

  // useEffect(() => {
  //   setTriggeredAction("");
  //   setTriggeredTask("");
  // }, [someTaskRuns]);

  // useEffect(() => {
  //   setTriggeredTask("");
  //   setSomeTaskRuns(tasks.some((task) => /run/i.test(task.status)));
  //   setTasksInQueue(tasks);
  //   // console.log("/run/i.test(task.status", /run/i.test(task.status));
  // }, [tasks]);

  const headers: T_ColumnHeader = {
    position: "Position",
    name: "Task Name",
    status: "Status",
    last_run: "Last Run (Server Time)",
    // countdown: "Countdown",
    action: "Action",
    order: "Order",
  };

  return (
    <>
      {/* <Parallel parallel={parallel || ""} />
      <br></br>
      <Limit limit={limit || ""} /> */}
      <br></br>
      <Table className="queue" headers={headers} rows={rows} />
    </>
  );
};
export default Queue;
