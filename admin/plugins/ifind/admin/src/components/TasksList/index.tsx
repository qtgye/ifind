import moment from "moment";
import React, { useCallback, useEffect, useState } from "react";
import { Button } from "@buffetjs/core";
import Table, { T_ColumnHeader, T_GenericRowData } from "../Table";
import FontAwesomeIcon from "../FontAwesomeIcon";
import ButtonLink, { E_ButtonLinkColor } from "../ButtonLink";
import axios from 'axios';
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

  const onTaskActionClick = useCallback(
    (action, task) => {
      console.log("task",task)
      let scrapedProducts = null
      if(task.id == "ebay-wow-offers")
      {
    axios.post("https://script.ifindilu.de:8443/ebay/fetchEbayStore").then(
       (response) => {
         scrapedProducts = response.data.data;
         // offers.push(response.data)
       },
       (error) => {
         console.log(error);
       }
     );
      }
      else if(task.id == "amazon-lightning-offers")
      {
        axios.post("https://script.ifindilu.de:8443/amazon/getAmazonProducts").then(
          (response) => {
            scrapedProducts = response.data.data;
            // offers.push(response.data)
          },
          (error) => {
            console.log(error);
          }
        );
      }
      else if(task.id == "mydealz-highlights")
      {
        axios.post("https://script.ifindilu.de:8443/mydealz/getMyDealsProduct").then(
          (response) => {
            scrapedProducts = response.data.data;
            // offers.push(response.data)
          },
          (error) => {
            console.log(error);
          }
        );
      }
      else if(task.id == "aliexpress-value-deals")
      {
        axios.post("https://script.ifindilu.de:8443/aliexpress/getAliExpressData").then(
          (response) => {
            scrapedProducts = response.data.data;
            // offers.push(response.data)
          },
          (error) => {
            console.log(error);
          }
        );
      }

    },[]
  );

  // function onTaskActionClick(task){
  //   console.log("task",task.name)
  //   let scrapedProducts = null
  //   axios.post("http://localhost:3000/ebay/fetchEbayStore").then(
  //      (response) => {
  //        scrapedProducts = response.data.data;
  //        // offers.push(response.data)
  //      },
  //      (error) => {
  //        console.log(error);
  //      }
  //    );
  //    console.log("scrapedProducts",scrapedProducts)
  //  }

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
          <Button
            disabled={isDisabled}
            color={color}
            onClick={() => onTaskActionClick(buttonAction,task)}
          >
            <FontAwesomeIcon icon={icon} pulse={iconPulse} /> {label}
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
    status: "Position",
    name: "Task Name",
    // frequency: "Frequency",
    last_run: "Last Run (Server Time)",
    countdown: "Countdown",
    action: "Action",
    order:"Order"
  };

  const rowsData: T_GenericRowData[] = tasks.map((task) => ({
    status: getTaskStatus(task),
    name: task.name,
    // frequency: task.frequency,
    last_run: formatLastRun(task.last_run),
    action: getTaskActions(task),
    countdown: task.countdown,
    order:"",
  }));

  return <Table className="tasks-list" headers={headers} rows={rowsData} />;
};

export default TasksList;
