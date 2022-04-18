import { AppProps } from "next/app";
import { ParsedUrlQuery } from "querystring";

declare interface AppPropsExtended extends AppProps {
  globalData: GlobalContextData;
  query: ParsedUrlQuery
}
