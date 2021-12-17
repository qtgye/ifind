import React from "react";
import HeaderSideNavMenuItem from "./HeaderSideNavMenuItem";
import withConditionalRender from "@utilities/hocs/withConditionalRender";

const HeaderSideNavSubMenu = ({
  categories,
  checked,
  checkChange,
}: HeaderSideNavSubMenuProps) => {
  return (
    <>
      {categories?.map((category) => (
        <HeaderSideNavMenuItem
          category={category}
          checked={checked}
          checkChange={checkChange}
          key={category?.id}
        />
      ))}
    </>
  );
};

export default withConditionalRender<HeaderSideNavSubMenuProps>(
  HeaderSideNavSubMenu
);
