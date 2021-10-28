declare module "react-shadow-root" {}
declare module "react-country-flag" {
  import * as React from "react";
  export interface ReactCountryFlagProps {
    countryCode: string;
    svg?: boolean;
  }
  export default class ReactCountryFlag extends React.Component<
    ReactCountryFlagProps,
    any
  > {}
}

declare module "react-shadow-root" {
  import React from "react";
  export default class ReactShadowRoot extends React.Component<any, any> {}
}
