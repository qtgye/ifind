declare interface FooterContentProps {
  logo?: string;
  text?: string;
  call?: string;
  phone?: string;
  copyright?: string;
  copyright2?: string;
  link?: string;
  affiliate?: string;
}

declare interface FooterLink {
  label?: string;
  path?: string;
}

declare interface SocialNetworkLink {
  type?: SOCIAL_NETWORK_TYPE;
  url?: string;
}
