import React, { useCallback, ComponentProps, useEffect, useState } from "react";
import { Header } from "@buffetjs/custom";
import { useHistory } from "react-router-dom";

import pluginId from "../../pluginId";
import {
  useScheduledTasksList,
  ScheduledTasksListProvider,
} from "../../providers/scheduledTasksListProvider";
import TasksList from "../../components/TasksList";
import FontAwesomeIcon from "../../components/FontAwesomeIcon";
import LogsList from "../../components/LogsList";
import axios from 'axios';


import "./styles.scss";

const ScheduledTasks = () => {
  const history = useHistory();
  const {startTask,stopTask,serverTimeFormatted, logs } =
    useScheduledTasksList();
  // const [tasks,setTasks] = useState(null) 
  const tasks =  [
    {
      id: "amazon-lightning-offers",
      name: "Amazon Lightning Offers",
      // schedule: frequencies.hourly,
      timeout_minutes: 120,
      meta: {
        deal_type: "amazon_flash_offers",
        deal_merchant: "amazon",
      },
    },
    {
      id: "ebay-wow-offers",
      name: "Ebay Wow Offers",
      // schedule: frequencies.hourly,
      timeout_minutes: 120,
      meta: {
        deal_type: "ebay_wow_offers",
        deal_merchant: "ebay",
      },
    },
    {
      id: "aliexpress-value-deals",
      name: "AliExpress Super Value Deals",
      // schedule: frequencies.hourly,
      timeout_minutes: 120,
      meta: {
        deal_type: "aliexpress_value_deals",
        deal_merchant: "aliexpress",
      },
    },
    {
      id: "mydealz-highlights",
      name: "MyDealz Highlights",
      // schedule: frequencies.hourly,
      timeout_minutes: 120,
      meta: {
        deal_type: "mydealz_highlights",
      },
    },
  ]; 

  // useEffect(() => {
    
  //   axios.post("http://164.90.181.113:3000/task/getTaskList").then(
  //     (response) => {
  //       setTasks(response.data.tasks);
  //       // offers.push(response.data)
  //     },
  //     (error) => {
  //       console.log(error);
  //     }
  //   );
  // },[]);

  const onTaskAction = useCallback(
    (action, taskID) => {
      switch (action) {
        case "start":
          startTask && startTask(taskID);
          break;
        case "stop":
          stopTask && stopTask(taskID);
          break;
      }
    },
    [startTask, stopTask]
  );

  // return (
  //   <div className="container scheduled-tasks">
  //     <Header
  //       title={{ label: "Scheduled Tasks" }}
  //       actions={[
  //         {
  //           Component: () => (
  //             <div className="scheduled-tasks__server-time">
  //               <strong>Server Time:&nbsp;</strong> {serverTimeFormatted} (UTC)
  //             </div>
  //           ),
  //         },
  //       ]}
  //     />
  //     <TasksList tasks={tasks || []} onTaskAction={onTaskAction} />
  //     <div className="scheduled-tasks__logs">
  //       <LogsList logs={logs || []} title="Runner Logs" />
  //     </div>
  //   </div>
  // );

  console.log("taskLists",tasks)
  return(<div>
     <div className="container scheduled-tasks">
       <Header
        title={{ label: "Scheduled Tasks" }}
        actions={[
          {
            Component: () => (
              <div className="scheduled-tasks__server-time">
                <strong>Server Time:&nbsp;</strong> {serverTimeFormatted} (UTC)
              </div>
            ),
          },
        ]}
      />
      <TasksList tasks={tasks || []} onTaskAction={onTaskAction} />
     </div>
  </div>)
};

export default (props: ComponentProps<any>) => (
  <ScheduledTasksListProvider>
    <ScheduledTasks {...props} />
  </ScheduledTasksListProvider>
);
