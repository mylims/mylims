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
}

export function EditableTable({
  columns,
  rows,
  onChange,
  prepend: generalPrepend = '',
}: EditableTableProps) {
  const [data, setData] = useState<Value[]>([]);
  const [columnModifiers, setColumnModifiers] = useState<Value>({});
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
    // Don't add column modifiers to the dependency list to avoid overwriting single values
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
    <div className="border-b shadow border-neutral-200 sm:rounded-lg">
      <div className="overflow-x-auto overflow-y-visible align-middle ">
        <table className="w-full divide-y table-auto divide-neutral-200">
          <thead className="bg-neutral-50">
            <tr>
              <th className="px-4 py-2 max-w-max">
                <Input
                  label="Code"
                  name="prepend"
                  value={prepend}
                  onChange={({ target }) => setPrepend(target.value)}
                />
              </th>
              {columns.map((column) => (
                <th key={column.name} className="px-4 py-2 max-w-max">
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
          <tbody className="bg-white divide-y divide-neutral-200">
            {data.map((row, rowIndex) => (
              <tr key={rowIndex}>
                <td className="px-4 py-2 max-w-max">{`${generalPrepend}${prepend}${
                  rowIndex + 1
                }`}</td>
                {columns.map((column) => (
                  <td key={column.name} className="px-4 py-2 max-w-max">
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
