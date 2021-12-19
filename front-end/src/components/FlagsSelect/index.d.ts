declare interface FlagSelectCountryLabel {
  country: string;
  label?: string;
}

declare interface FlagSelectProps {
  selected?: string;
  onSelect?: (flag: string) => void;
  placeholder?: string;
  className?: string;
  customLabels?: { [countryCode: string]: string };
}
