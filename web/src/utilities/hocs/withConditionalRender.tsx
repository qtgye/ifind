import React from "react";

/**
 * Adds renderIf prop to a component to
 * condiitionally render it if renderIf is true
 * @param Component
 * @returns React.FunctionComponent
 */
const withConditionalRender: WithConditionalRenderType = (Component) => ({
  renderIf,
  ...props
}) => (renderIf ? <Component {...props} /> : null);

export default withConditionalRender;
