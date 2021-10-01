import React, { ReactNode } from 'react';

export type T_Column = JSX.Element|string;

export interface I_RowProps {
  columns: Array<T_Column>
  className?: string
}

export type T_Row = (props: I_RowProps) => JSX.Element;

const Row : T_Row = ({ columns = [], className = '' }) => {
  return (
    <tr className={[ 'table-row', className ].join(' ')}>
      {columns.map(column => (
        <td>{column}</td>
      ))}
    </tr>
  );
}

export default Row;