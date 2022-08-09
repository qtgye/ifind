import React, { HTMLProps, PropsWithChildren, ReactNode } from "react";

export type T_Column = {
  property: string;
  content?: JSX.Element | string;
};

export interface I_RowProps {
  columns: Array<T_Column>;
  props: HTMLProps<HTMLTableRowElement>;
}

export type T_Row = (props: I_RowProps) => JSX.Element;

const Row: T_Row = ({ columns = [], props }) => {
  return (
    <tr className={["table-row", props?.className].join(" ")}>
      {columns.map((column) => (
        <td className={`table-column--${column.property}`}>{column.content}</td>
      ))}
    </tr>
  );
};

export default Row;
