import React from "react";
import {
  FontAwesomeIcon as Icon,
  FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { IconName } from "@fortawesome/fontawesome-common-types";

interface FAIconProps extends FontAwesomeIconProps {
  icon: IconName;
}

const FontAwesomeIcon = (props: FAIconProps) => <Icon {...props} />;

export default FontAwesomeIcon;
