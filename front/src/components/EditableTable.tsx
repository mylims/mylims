import React, { useEffect, useState } from 'react';

import { Input } from '@/components/tailwind-ui';

type Value = Record<string, string | undefined>;
interface Column {
  name: string;
  label: string;
}
interface EditableTableProps {
  columns: Column[];
  rows: number;
  onChange(data: Value[]): void;
  prepend?: string;
  initialValue?: Value;
}

export function EditableTable({
  columns,
  rows,
  onChange,
  prepend: generalPrepend = '',
  initialValue,
}: EditableTableProps) {
  const [data, setData] = useState<Value[]>([]);
  const [columnModifiers, setColumnModifiers] = useState<Value>(
    initialValue ?? {},
  );
  const [prepend, setPrepend] = useState('');

  // When the rows change, create the new data from column modifiers
  useEffect(
    () => {
      let newData = new Array(rows);
      for (let i = 0; i < rows; i++) {
        newData[i] = {};
        for (const [key, value] of Object.entries(columnModifiers)) {
          if (value) newData[i][key] = value;
        }
      }
      setData(newData);
    },
    // Don't add columnModifiers to the dependency list to avoid overwriting single values
    [rows],
  );

  // Notifies parent the data has changed
  useEffect(() => {
    const newData = data.map((row, index) => ({
      ...row,
      code: `${prepend}${index + 1}`,
    }));
    onChange(newData);
  }, [data, prepend]);

  const onColumnModifierChange = (value: string, name: string) => {
    setColumnModifiers({ ...columnModifiers, [name]: value || undefined });
    setData(data.map((row) => ({ ...row, [name]: value || undefined })));
  };

  return (
    <div className="border-b border-neutral-200 shadow sm:rounded-lg">
      <div className="overflow-x-auto overflow-y-visible align-middle ">
        <table className="w-full table-auto divide-y divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="max-w-max px-4 py-2">
                <Input
                  label="Code"
                  name="prepend"
                  value={prepend}
                  onChange={({ target }) => setPrepend(target.value)}
                />
              </th>
              {columns.map((column) => (
                <th key={column.name} className="max-w-max px-4 py-2">
                  <Input
                    label={column.label}
                    name={column.name}
                    value={columnModifiers[column.name] ?? ''}
                    onChange={(e) =>
                      onColumnModifierChange(e.target.value, column.name)
                    }
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-200 bg-white">
            {data.map((row, rowIndex) => (
              // eslint-disable-next-line react/no-array-index-key
              <tr key={rowIndex}>
                <td className="max-w-max px-4 py-2">{`${generalPrepend}${prepend}${
                  rowIndex + 1
                }`}</td>
                {columns.map((column) => (
                  <td key={column.name} className="max-w-max px-4 py-2">
                    <Input
                      label={column.label}
                      name={column.name}
                      hiddenLabel
                      value={row[column.name] ?? ''}
                      onChange={(e) => {
                        const { value } = e.target;
                        let newData = [...data];
                        newData[rowIndex][column.name] = value;
                        setData(newData);
                      }}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
