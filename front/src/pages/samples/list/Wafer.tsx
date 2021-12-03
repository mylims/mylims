import React from 'react';
import { Link } from 'react-router-dom';
import { InformationCircleIcon } from '@heroicons/react/outline';

import { Button, Color, Roundness, Variant } from '@/components/tailwind-ui';
import { Table as TableQuery } from '@/components/TableQuery';
import ElnLayout from '@/components/ElnLayout';

import SamplesList from './Default';

export default function WaferList() {
  return (
    <SamplesList kind="wafer">
      <TableQuery.ActionsColumn>
        {(row) => (
          <Link title="detail" to={`/sample/detail/wafer/${row.id}`}>
            <Button
              color={Color.primary}
              roundness={Roundness.circular}
              variant={Variant.secondary}
              className="ml-2"
            >
              <InformationCircleIcon className="w-5 h-5" />
            </Button>
          </Link>
        )}
      </TableQuery.ActionsColumn>
    </SamplesList>
  );
}

WaferList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
