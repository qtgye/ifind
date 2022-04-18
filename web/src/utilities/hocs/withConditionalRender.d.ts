declare interface WithConditionalRenderProps {
  renderIf?: boolean;
}

declare type WithConditionalRenderType = <PropType>(
  Component: React.ReactNode<PropType>
) => React.FunctionComponent<PropType & WithConditionalRenderProps>;
