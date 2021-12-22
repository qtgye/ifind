import React, { useEffect, useState } from "react";

import Icon from "../IconItem";
import { iconsList } from "ifind-icons";

// Dynamically import each icon in order for webpack
// to include them in the build
const iconPathsPromise = Promise.all(
  iconsList.map((icon) => import(`../../icons/${icon}.svg`))
);

import "./styles.scss";

const IconsList = () => {
  const [iconPaths, setIconPaths] = useState([]);

  useEffect(() => {
    iconPathsPromise.then((iconPaths) => {
      setIconPaths(iconPaths.map(({ default: iconPath }) => iconPath));
    });
  }, []);

  return (
    <div className="icons-list">
      {iconPaths.length
        ? iconPaths.map((iconPath, index) => (
            <div className="icons-list__item">
              <Icon iconPath={iconPath} />
              <strong className="icons-list__name">{iconsList[index]}</strong>
            </div>
          ))
        : null}
    </div>
  );
};

export default IconsList;
