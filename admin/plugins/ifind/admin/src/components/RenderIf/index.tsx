import React from "react";

interface RenderIfProps {
  condition: boolean;
  children?: React.ReactNode;
}

const RenderIf = ({ condition, children }: RenderIfProps) =>
  condition ? children : null;

export default RenderIf;