import React from "react";
import { Link } from "react-router-dom";
import FontAwesomeIcon from "../FontAwesomeIcon";

const InputIcon = ({ icon, iconLink }) => {
  const IconElement = iconLink ? "a" : "span";
  const props = {
    className: "input-icon",
  };

  if (iconLink) {
    props.href = iconLink;
  }

  return icon ? (
    <IconElement {...props}>
      <FontAwesomeIcon icon={icon} />
    </IconElement>
  ) : null;
};

export default InputIcon;
