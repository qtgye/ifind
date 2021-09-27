import React, {
  FunctionComponent,
  useCallback,
  useEffect,
  useState,
  useRef,
} from "react";
import { Header } from "@buffetjs/custom";

import FontAwesomeIcon from "../../components/FontAwesomeIcon";

import "./styles.scss";

const ScheduledTasks = () => {
  return (
    <div className="container scheduled-tasks">
      <Header title={{ label: "Scheduled Tasks" }} />
    </div>
  );
};

export default ScheduledTasks;
