declare interface NavPillItemTranslatableLabel {
  language: string;
  label: string;
}

declare interface NavPillItemProps {
  label: NavPillItemTranslatableLabel[];
  href: string;
  active?: boolean;
}

declare interface NavPillsProps {
  items?: NavPillItemProps[];
}
