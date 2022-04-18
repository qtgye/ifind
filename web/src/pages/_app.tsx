import "styles/main.scss";
import type { AppContext } from "next/app";
import App from "next/app";

import type { AppPropsExtended } from "./_app.d";
import {
  getGlobalData,
  GlobalContextProvider,
} from "providers/globalDataContext";
import {
  GlobalStateContextProvider,
} from 'providers/globalStateContext';

function MyApp({ Component, pageProps, globalData, query }: AppPropsExtended) {

  // Wrap page component with GlobalContextProvider
  // to allow usage of useGlobalContext withing pages and components
  return (
    <GlobalContextProvider data={globalData}>
      <GlobalStateContextProvider>
        <Component {...pageProps} query={query} />;
      </GlobalStateContextProvider>
    </GlobalContextProvider>
  );
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  const { router } = appContext;
  const { language } = router.query;

  // Get global data
  const [globalData, appProps] = await Promise.all([
    // Fetch initial global data
    getGlobalData({ language } as GetGlobalDataParams),
    // calls page's `getInitialProps` and fills `appProps.pageProps`
    App.getInitialProps(appContext),
  ]);

  return {
    query: router.query,
    globalData,
    ...appProps,
  };
};

export default MyApp;
