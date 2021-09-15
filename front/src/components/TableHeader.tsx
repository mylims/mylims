import React from 'react';

import { Th } from '@/components/tailwind-ui';

interface TableHeaderProps {
  titles: Array<{ name: string; className?: string }>;
}

export default function TableHeader({ titles }: TableHeaderProps) {
  return (
    <tr>
      {titles.map(({ name, className }) => (
        <Th key={name} className={className}>
          {name}
        </Th>
      ))}
    </tr>
  );
}
