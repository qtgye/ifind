import { useState, useCallback, useEffect } from "react";
import { useTags } from "@contexts/tagsContext";

import TagsFiterItem from "./item";

import "./styles.scss";

const TagsFilter = ({
  selectedTags,
  onUpdate,
}: TagsFilterProps) => {
  const { tags } = useTags();
  const [tagOptions, setTagOptions] = useState<SelectableTag[]>([]);

  const onTagClick = useCallback(
    (tag) => {
      const updatedTagOptions = tagOptions.map((tagOption: SelectableTag) => {
        tagOption.selected =
          tag.id === tagOption.id ? !tagOption.selected : tagOption.selected;
        return tagOption;
      });

      setTagOptions(updatedTagOptions);

      // Return only active tags
      if (typeof onUpdate === "function") {
        onUpdate(
          updatedTagOptions
            .filter(({ selected }) => selected)
            .map(({ id }) => id)
        );
      }
    },
    [tagOptions, onUpdate]
  );

  const checkTagOptions = useCallback(() => {
    if ( tags?.length ) {
      setTagOptions(
        tags?.map((tag: Tag) => ({
          ...tag,
          selected: selectedTags.includes(tag.id),
        }))
      )
    }
    else {
      setTagOptions([]);
    }
  }, [tags, selectedTags]);

  useEffect(() => {
    checkTagOptions();
  }, [tags, selectedTags, checkTagOptions]);

  return (
    <div className="tags-filter">
      {tagOptions.map((tag) => (
        <TagsFiterItem key={tag.id} tag={tag} onClick={onTagClick} />
      ))}
    </div>
  );
};

export default TagsFilter;
