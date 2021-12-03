import React, { useCallback } from "react";
import { Option } from "@buffetjs/core";

interface TagSelectOptionProps {
  tag: Tag;
  onClose: (tag: Tag) => void;
}

const TagSelectOption = ({ tag, onClose }: TagSelectOptionProps) => {
  // Use english label
  const englishLabel: ComponentAtomsTranslateableLabel | null =
    tag.label?.find((label) => label?.language?.code === "en") || null;
  const label: string = englishLabel?.label || "";

  const onClick = useCallback(
    (e) => {
      if (typeof onClose === "function") {
        onClose(tag);
      }
    },
    [onClose]
  );

  return (
    <Option className="tag-select__option" label={label} onClick={onClick} />
  );
};

export default TagSelectOption;
