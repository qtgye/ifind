import React, { useCallback } from "react";

const TagsFiterItem = ({ tag, onClick }: TagsFiterItemProps) => {
  const label: string =
    tag.label?.find((label) => label?.language?.code === "en")?.label || "";

  const classNames = [
    "tags-filter__item",
    tag.selected ? "tags-filter__item--active" : "",
  ].filter(Boolean);

  const onTagClick: React.MouseEventHandler<HTMLButtonElement> = useCallback((e: React.MouseEvent) => {
    e.preventDefault();

    if ( typeof onClick === 'function' ) {
      onClick(tag);
    }
  }, [ onClick, tag ]);

  return <button className={classNames.join(" ")} onClick={onTagClick}>{label}</button>;
};

export default TagsFiterItem;
