import React, { useCallback, useEffect, useState } from "react";
import { useLanguages } from "providers/languagesContext";

const TagsFiterItem = ({ tag, onClick }: TagsFiterItemProps) => {
  const { userLanguage } = useLanguages();
  const [label, setLabel] = useState("");

  const classNames = [
    "tags-filter__item",
    tag.selected ? "tags-filter__item--active" : "",
  ].filter(Boolean);

  const onTagClick: React.MouseEventHandler<HTMLButtonElement> = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();

      if (typeof onClick === "function") {
        onClick(tag);
      }
    },
    [onClick, tag]
  );

  useEffect(() => {
    if (tag?.label?.length) {
      const matchedLanguageLabel = tag.label?.find(
        (label) => label?.language?.code === userLanguage
      );
      setLabel(matchedLanguageLabel?.label || tag.label[0]?.label || "");
    }
  }, [tag, userLanguage]);

  return (
    <button className={classNames.join(" ")} onClick={onTagClick}>
      {label}
    </button>
  );
};

export default TagsFiterItem;
