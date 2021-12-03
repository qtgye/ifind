import React from "react";

interface WithConditionalRenderProps {
  renderIf: boolean;
}

const withConditionalRender =
  (Component?: React.FunctionComponent | React.ReactNode | JSX.Element | null) =>
  ({ renderIf, ...props }: WithConditionalRenderProps) =>
  Component && renderIf ? <Component {...props} /> : null;

export default withConditionalRender;
