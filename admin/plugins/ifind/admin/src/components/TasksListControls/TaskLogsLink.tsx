import React from "react";

import { generatePluginLink } from "../../helpers/url";
import ButtonLink, { E_ButtonLinkColor } from "../ButtonLink";
import FontAwesomeIcon from "../FontAwesomeIcon";

const TaskLogsLink = ({ task }: TaskLogsLinkProps) => (
  <ButtonLink
    routerLink
    href={generatePluginLink(`/scheduled-task/${task}`, null, false)}
    color={E_ButtonLinkColor.secondary}
    title={`Show Logs Page for ${task}`}
  >
    <FontAwesomeIcon icon="terminal" />
  </ButtonLink>
);

export default TaskLogsLink;
