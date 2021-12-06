import React from 'react';
import { Link } from 'react-router-dom';
import { EyeIcon, InformationCircleIcon } from '@heroicons/react/outline';

import {
  Button,
  Card,
  Color,
  Roundness,
  Variant,
} from '@/components/tailwind-ui';
import { Table as TableQuery } from '@/components/TableQuery';
import ElnLayout from '@/components/ElnLayout';

import SamplesList from './Default';

export default function WaferList() {
  return (
    <div className="grid grid-cols-4 gap-4">
      <div className="col-span-3">
        <SamplesList kind="wafer">
          <TableQuery.TextColumn
            title="heterostructure"
            dataPath="meta.heterostructure"
            disableSearch
          />
          <TableQuery.TextColumn
            title="substrate"
            dataPath="meta.substrate"
            disableSearch
          />
          <TableQuery.TextColumn
            title="size"
            dataPath="meta.size"
            disableSearch
          />
          <TableQuery.TextColumn
            title="ICMP"
            dataPath="meta.ICMP"
            disableSearch
          />
          <TableQuery.ActionsColumn>
            {(row) => (
              <>
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
                <Button
                  title="preview"
                  color={Color.success}
                  roundness={Roundness.circular}
                  variant={Variant.secondary}
                  className="ml-2"
                >
                  <EyeIcon className="w-5 h-5" />
                </Button>
              </>
            )}
          </TableQuery.ActionsColumn>
        </SamplesList>
      </div>
      <div className="mt-14">
        <Card>
          <Card.Header className="text-xs font-semibold tracking-wider text-left uppercase bg-neutral-50 text-neutral-500">
            Preview
          </Card.Header>
          <Card.Body>
            <p>
              Wafer is a sample that is used to test the performance of a
              process.
            </p>
          </Card.Body>
        </Card>
      </div>
    </div>
  );
}

WaferList.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
