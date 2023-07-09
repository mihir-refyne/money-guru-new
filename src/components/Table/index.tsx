import { ReactElement, ReactNode } from "react";
import styles from "./styles.module.css";

export interface TableColumn<T> {
  field: keyof T;
  label: string;
  color?: string;
  alignment?: "center" | "left" | "right";
  renderValue?: (value: T[keyof T], rowData: T) => ReactNode;
}

interface TableProps<T> {
  columns: Array<TableColumn<T>>;
  uniqueKeyName?: keyof T;
  data: Array<T>;
  noDataView?: ReactElement | null;
}

export default function Table<T extends Record<string, any>>(
  props: TableProps<T>
) {
  const { columns, data, noDataView } = props;
  if (data.length < 1) return noDataView ?? null;
  return (
    <div className={styles.Table__Wrapper}>
      <table>
        <thead>
          <tr>
            {columns.map((column) => {
              return (
                <th
                  key={column.field.toString()}
                  className="text-caption text-semibold"
                  style={{
                    textAlign: column.alignment,
                    color: column.color,
                  }}
                >
                  {column.label}
                </th>
              );
            })}
          </tr>
        </thead>
        <TableBody {...props} />
      </table>
    </div>
  );
}

function TableBody<T extends Record<string, unknown>>({
  data,
  uniqueKeyName,
  columns,
}: TableProps<T>) {
  return (
    <tbody>
      {data.map((rowData, rowIndex) => {
        const rowKey = uniqueKeyName ? rowData[uniqueKeyName] : rowIndex;
        return (
          <tr key={String(rowKey)}>
            {columns.map((column) => {
              const value = rowData[column.field];
              const finalValue =
                column.renderValue?.(value, rowData) ?? (value as ReactNode);
              return (
                <td
                  key={column.field.toString()}
                  className="text-caption text-medium"
                  style={{ textAlign: column.alignment }}
                >
                  {finalValue}
                </td>
              );
            })}
          </tr>
        );
      })}
    </tbody>
  );
}
