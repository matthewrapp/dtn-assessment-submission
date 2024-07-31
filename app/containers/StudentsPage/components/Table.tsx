import React from 'react';

type Props = { children: React.ReactNode };
const Table = ({ children }: Props) => {
  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left rtl:text-right text-stone-600 table-auto border-b-[1px] border-stone-300">
        {children}
      </table>
    </div>
  );
};

export default Table;

export const TableHead = ({ children }: { children: React.ReactNode }) => {
  return (
    <thead className="text-xs text-stone-200 uppercase bg-stone-700">
      {children}
    </thead>
  );
};

export const TableRow = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => {
  return <tr className={`${className || ''}`}>{children}</tr>;
};

export const TableHeadCell = ({
  children,
  onClick,
}: {
  children: React.ReactNode;
  onClick?: () => void;
}) => {
  return (
    <th
      scope="col"
      className={`px-6 py-3 ${
        onClick
          ? 'cursor-pointer hover:scale-105 duration-200 transition-all'
          : ''
      }`}
      onClick={() => {
        onClick && onClick();
      }}
    >
      {children}
    </th>
  );
};

export const TableBody = ({ children }: { children: React.ReactNode }) => {
  return <tbody className="">{children}</tbody>;
};

export const TableCell = ({
  children,
  className,
  colSpan = 1,
}: {
  children: React.ReactNode;
  className?: string;
  colSpan?: number;
}) => {
  return (
    <td colSpan={colSpan} className={`px-6 py-4 ${className || ''}`}>
      {children}
    </td>
  );
};
