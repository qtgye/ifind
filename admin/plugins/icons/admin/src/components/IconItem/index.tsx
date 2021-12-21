import React from "react";

declare interface IconProps {
  iconPath: string;
}

const Icon = ({ iconPath }: IconProps) => {
  return (
    <div className="ifind-icon">
      <div className="ifind-icon__image" style={{
        ['--icon-path' as string]: `url(${iconPath})`
      }}></div>
      {/* <img src={iconPath} alt="" className="ifind-icon__image" /> */}
    </div>
  );
};
export default Icon;
