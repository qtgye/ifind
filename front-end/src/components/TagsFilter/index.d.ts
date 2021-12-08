declare interface TagsFilterProps extends React.HTMLAttributes<HTMLElement> {
  onUpdate?: (tags: (string|number)[]) => void;
  selectedTags: (string | number)[];
}

declare interface SelectableTag extends Tag {
  selected: boolean;
}

declare interface TagsFiterItemProps
  extends React.HtmlHTMLAttributes<HTMLElement> {
  tag: SelectableTag;
  onClick: (tag: SelectableTag) => void;
}
