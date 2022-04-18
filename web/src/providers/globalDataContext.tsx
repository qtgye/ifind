import {
  createContext,
  useContext,
  useCallback,
  useState,
  ReactNode,
} from "react";
import type { PropsWithChildren } from "react";
import { useRouter } from "next/router";

import gqlFetch from "utilities/gqlFetch";
// import { getLanguages } from "./languagesContext";
// import { getSourcesRegions } from "./sourceRegionContext";

// TODO: Move this to languages provider
export const getLanguages = async () =>
  gqlFetch<LanguagesPayload>(`
    query Languages {
      languages {
        code
        name
        country_flag
      }
    }
  `);

// TODO: Move this to sourcesRegions provider
export const getSourcesRegions = async () =>
  gqlFetch<SourceRegionContextData>(`
    query SourceRegionQuery {
      sources {
          id
          name
          button_logo {
              url
          }
      }
      regions {
          id
          name
      }
    }
`);

const globalDataQuery = `
  query GlobalDataQuery ($language: String) {
    footerSettingsByLanguage (language: $language) {
        footer_links {
            label
            page {
                slug
            }
        }
        footer_text
        footer_footnote
    }
    socialNetwork {
      social_network {
        url
        type
      }
    }
    contactDetail {
      phone_number
      email
    }
  }`;

/**
 * This context should contain global data:
 * - Site data (contact infos, logo, etc.)
 * - Navigation items ?
 * - Footer items ?
 */
const GlobalContext = createContext<GlobalContextData>({});

export const GlobalContextProvider = ({
  children,
  data = {},
}: PropsWithChildren<ReactNode> & {
  data: GlobalContextData;
}) => {
  const {
    query: { language },
  } = useRouter();
  const [globalData] = useState<Partial<GlobalContextData>>(data);

  return (
    <GlobalContext.Provider
      value={{
        ...globalData,
        userLanguage: language as string,
      }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

export const useGlobalData = () => useContext(GlobalContext);

export const getGlobalData = async ({
  language = "en",
}: GetGlobalDataParams): Promise<GlobalContextData> => {
  const [globalData, { languages }, { sources, regions }] = await Promise.all([
    gqlFetch<GlobalDataPayload>(globalDataQuery, { language }),
    getLanguages(),
    getSourcesRegions(),
  ]);

  return {
    contactInfo: globalData?.contactDetail,
    footerSetting: globalData?.footerSettingsByLanguage,
    socialNetwork: globalData?.socialNetwork,
    languages,
    sources,
    regions,
  };
};

// Export as default to be used in testing
export default GlobalContext;
