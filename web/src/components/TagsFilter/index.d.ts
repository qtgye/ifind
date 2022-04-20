declare interface TagsFilterProps extends React.HTMLAttributes<HTMLElement> {
  onUpdate?: (activeTag?: string | number) => void;
  activeTag?: string | number;
}

declare interface SelectableTagLabelOverride {
  label:
    | ({
        label?: string;
        language?: {
          code: string;
        };
      } | null)[]
    | null;
}

declare interface SelectableTag
  extends Partial<Pick<Tag, "id"> & SelectableTagLabelOverride> {
  selected: boolean;
}

declare interface TagsFiterItemProps
  extends React.HtmlHTMLAttributes<HTMLElement> {
  tag: SelectableTag;
  onClick: (tag: SelectableTag) => void;
}
