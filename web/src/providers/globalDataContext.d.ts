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

declare interface GlobalDataPayload {
  footerSettingsByLanguage: FooterSetting;
  socialNetwork: SocialNetwork;
  contactDetail: ContactInfo;
}

declare interface GlobalContextData {
  contactInfo?: ContactInfo;
  footerSetting?: FooterSetting;
  socialNetwork?: SocialNetwork;
  userLanguage?: string;
  // Initial  data
  languages?: Language[];
  sources?: Source[];
  regions?: Region[];
}

declare interface GetGlobalDataParams {
  language?: string;
}

declare interface LanguagesPayload {
  languages: Language[];
}

declare interface GlobalContextProviderProps {
  children: ReacctNode;
  data: GlobalContextData;
}
