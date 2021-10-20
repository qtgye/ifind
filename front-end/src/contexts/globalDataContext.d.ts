declare interface ContactInfo {
  phone_number?: string;
  supportPhone?: string;
  supportEmail?: string;
}

declare interface FooterSetting {
  footer_text?: string;
  footer_footnote?: string;
  footer_links?: {
    label: string;
    page: {
      slug: string;
    };
  }[];
}

declare type SOCIAL_NETWORK_TYPE = "facebook" | "twitter" | "linkedin";

declare interface SocialNetwork {
  social_network: {
    url?: string;
    type?: SOCIAL_NETWORK_TYPE;
  }[];
}

declare interface GlobalContextData {
  contactInfo?: ContactInfo;
  footerSetting?: FooterSetting;
  socialNetwork?: SocialNetwork;
  withAmazonTags?: (args: any) => any;
}
