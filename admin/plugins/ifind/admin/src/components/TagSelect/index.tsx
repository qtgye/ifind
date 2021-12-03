import React, { useState, useCallback, useEffect } from "react";
import { Label } from "@buffetjs/core";

import { useTags } from "../../providers/tagsProvider";
import withConditionalRender from "../../helpers/withConditionalRender";

import InputBlock from "../InputBlock";
import CustomSelect from "../CustomSelect";
import RenderIf from "../RenderIf";
import TagSelectOption from "./option";

import "./styles.scss";

interface TagOption {
  value: string;
  label: string | JSX.Element;
}

interface TagSelectProps {
  tags?: (string | number)[];
  onChange: (selected: (string | number)[]) => void;
  label?: string;
}

const TagSelect = ({
  tags = [],
  onChange,
  label = "Select Tags",
}: TagSelectProps) => {
  const { tags: rawTags } = useTags();
  const [selectedTags, setSelectedTags] = useState<Tag[]>([]);
  const [tagsOptions, setTagsOptions] = useState<TagOption[]>([]);

  const onTagSelect = useCallback(
    ({ value }) => {
      const updatedTags: string[] = [...tags, value];

      if (typeof onChange === "function") {
        onChange(updatedTags);
      }
    },
    [tags, onChange]
  );

  const filterTagOptions = useCallback(() => {
    // Filter only tags not yet selected
    const filteredTags = rawTags?.filter(({ id }) => !tags.includes(id)) || [];
    // Extract value and label
    const _tagOptions = filteredTags.map(({ id, label }: Tag) => {
      // Select english label or the first given label
      const { label: optionLabel } =
        label?.find(
          (translatedLabel) => translatedLabel?.language?.code === "en"
        ) ||
        (label || [])[0] ||
        {};

      return {
        value: id,
        label: optionLabel || "",
      };
    });

    setTagsOptions(_tagOptions);
  }, [tags, rawTags]);

  const updateSeledtedTags = useCallback(() => {
    const _selectedTags = tags
      .map((tagID) => {
        const matchedTag = rawTags?.find((rawTag) => rawTag.id == tagID);
        return matchedTag || null;
      })
      .filter(Boolean) as Tag[];

    setSelectedTags(_selectedTags);
  }, [tags, rawTags]);

  // Removes closed tag from the tags list
  const onTagClose = useCallback(
    (tag: Tag) => {
      const trimmedTags = tags.filter((tagID) => tagID != tag.id);

      if (typeof onChange === "function") {
        onChange(trimmedTags);
      }
    },
    [tags]
  );

  useEffect(() => {
    filterTagOptions();
    updateSeledtedTags();
  }, [tags]);

  return (
    <InputBlock className="col-md-12">
      <Label htmlFor="" className="tag-select__label">
        {label}
      </Label>
      <div className="tag-select__interface">
        <RenderIf condition={selectedTags.length > 0}>
          <div className="tag-select__selected">
            {selectedTags.map((tag) => (
              <TagSelectOption tag={tag} onClose={onTagClose} />
            ))}
          </div>
        </RenderIf>
        <RenderIf condition={tagsOptions.length > 0}>
          <CustomSelect
            className="tag-select__dropdown"
            value=""
            options={tagsOptions}
            withSearch={true}
            onChange={onTagSelect}
          />
        </RenderIf>
      </div>
    </InputBlock>
  );
};

export default withConditionalRender(TagSelect as React.FunctionComponent);
