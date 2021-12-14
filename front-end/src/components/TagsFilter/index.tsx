import { useState, useCallback, useEffect, MouseEventHandler } from "react";
import { useTags } from "@contexts/tagsContext";
import { useGlobalState } from "@contexts/globalStateContext";
import { useLanguages } from "@contexts/languagesContext";
import { useBreakpoints } from "@utilities/breakpoints";

import TagsFiterItem from "./item";

import "./styles.scss";

const TagsFilter = ({ selectedTags, onUpdate }: TagsFilterProps) => {
  const { tags } = useTags();
  const { toggleBodyScroll } = useGlobalState();
  const { userLanguage } = useLanguages();
  const [tagOptions, setTagOptions] = useState<SelectableTag[]>([]);
  const [expanded, setExpanded] = useState<boolean>(false);
  const [overlap, setOverlap] = useState<boolean>(false);
  const currentBreakpoint = useBreakpoints();

  const classNames = [
    "tags-filter",
    expanded ? "tags-filter--expanded" : "",
    overlap ? "tags-filter--overlap" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const selected = tagOptions.filter((tag: SelectableTag) => tag.selected);

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
    if (tags?.length) {
      setTagOptions(
        tags?.map((tag: Tag) => ({
          ...tag,
          selected: selectedTags.includes(tag.id),
        }))
      );
    } else {
      setTagOptions([]);
    }
  }, [tags, selectedTags]);

  const onToggleClick = useCallback<MouseEventHandler>(
    (e) => {
      e.preventDefault();

      if (!expanded) {
        setOverlap(true);
      }

      setExpanded(!expanded);
    },
    [expanded]
  );

  const onCloseClick = useCallback<MouseEventHandler>((e) => {
    e.preventDefault();
    setExpanded(false);
  }, []);

  const onTransitionEnd = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        if (!expanded) {
          setOverlap(false);
        }
      }
    },
    [expanded]
  );

  const extractTagLabel = useCallback((tag: Tag) => {
    if ( userLanguage ) {
      const matchedLabel = tag.label?.find(label => label?.language?.code === userLanguage);

      if ( matchedLabel ) {
        return matchedLabel.label;
      }
    }

    const englishLabel = tag.label?.find(label => label?.language?.code === 'en');

    if ( englishLabel ) {
      return englishLabel.label;
    }

    const firstLabel = tag && tag.label ? tag && tag.label[0] : null;
    return firstLabel?.label || '';

  }, [ userLanguage ]);

  useEffect(() => {
    if (!/sm|md/i.test(currentBreakpoint)) {
      setExpanded(false);
    }
  }, [currentBreakpoint]);

  useEffect(() => {
    if (toggleBodyScroll) {
      toggleBodyScroll(!expanded);
    }
  }, [expanded, toggleBodyScroll]);

  useEffect(() => {
    checkTagOptions();
  }, [tags, selectedTags, checkTagOptions]);

  return (
    <div className={classNames}>
      <div className="tags-filter__heading">
        <div className="tags-filter__selected-list">
        {selected.map((tag) => (
          <span className="tags-filter__selected" key={tag.id}>{extractTagLabel(tag)}</span>
        ))}
        </div>
        <button className="tags-filter__toggle" onClick={onToggleClick}>
          +
        </button>
      </div>
      <div className="tags-filter__list" onTransitionEnd={onTransitionEnd}>
        {tagOptions.map((tag) => (
          <TagsFiterItem key={tag.id} tag={tag} onClick={onTagClick} />
        ))}
        <button
          className="tags-filter__close"
          onClick={onCloseClick}
          dangerouslySetInnerHTML={{ __html: "&times;" }}
        ></button>
      </div>
    </div>
  );
};

export default TagsFilter;
