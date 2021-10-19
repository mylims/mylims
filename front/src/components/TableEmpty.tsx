import { InboxIcon } from '@heroicons/react/solid';
import React from 'react';

import TableHeader from '@/components/TableHeader';
import { Td } from '@/components/tailwind-ui';

interface TableEmptyProps {
  titles: Array<{ name: string; className?: string }>;
}

export default function TableEmpty({ titles }: TableEmptyProps) {
  return (
    <table>
      <thead>
        <TableHeader titles={titles} />
      </thead>
      <tbody>
        <tr>
          <Td colSpan={4} align="center">
            <div className="flex flex-row justify-center text-neutral-500">
              <InboxIcon className="w-5 h-5 mr-2" />
              <span>Empty</span>
            </div>
          </Td>
        </tr>
      </tbody>
    </table>
  );
}
