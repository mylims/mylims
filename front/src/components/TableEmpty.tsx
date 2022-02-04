import { InboxIcon } from '@heroicons/react/solid';
import React from 'react';

import TableHeader from '@/components/TableHeader';
import { Td } from '@/components/tailwind-ui';

interface TableEmptyProps {
  titles: Array<{ name: string; className?: string }>;
}

export default function TableEmpty({ titles }: TableEmptyProps) {
  return (
    <table className="w-full">
      <thead>
        <TableHeader titles={titles} />
      </thead>
      <tbody>
        <tr>
          <Td colSpan={4} align="center">
            <div className="flex flex-row justify-center text-neutral-500">
              <InboxIcon className="mr-2 h-5 w-5" />
              <span>Empty</span>
            </div>
          </Td>
        </tr>
      </tbody>
    </table>
  );
}
