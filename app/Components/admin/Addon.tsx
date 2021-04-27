import React from 'react';

import { useAdonisContext } from '@ioc:React';

import type { Addon } from 'App/AddonsManager';

import env from '../../../env';
import Admin from '../layouts/Admin';
import { Button, Checkbox, Table } from '../tailwind-ui';

const backendUrl = env.BACKEND_URL;

function Header() {
  return (
    <tr>
      <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left uppercase bg-neutral-50 text-neutral-500">
        Name
      </th>
      <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left uppercase bg-neutral-50 text-neutral-500">
        Description
      </th>
      <th className="px-6 py-3 text-xs font-medium leading-4 tracking-wider text-left uppercase bg-neutral-50 text-neutral-500">
        Enabled
      </th>
    </tr>
  );
}

function Row({ value: addon, index }: { value: Addon; index: number }) {
  return (
    <tr key={index} className={index % 2 === 1 ? 'bg-neutral-50' : 'bg-white'}>
      <td className="px-6 py-4 text-sm font-medium leading-5 whitespace-no-wrap text-neutral-900">
        {addon.getDisplayName()}
      </td>
      <td className="px-6 py-4 text-sm leading-5 whitespace-no-wrap text-neutral-500">
        {addon.getDescription()}
      </td>
      <td className="px-6 py-4 text-sm leading-5 whitespace-no-wrap text-neutral-500">
        <Checkbox
          id={addon.getName()}
          name={addon.getName()}
          defaultChecked={addon.isEnabled}
        />
      </td>
    </tr>
  );
}

export default function AddonPage(props: { availableAddons: Addon[] }) {
  const { makeUrl } = useAdonisContext();

  return (
    <Admin>
      <div className="flex flex-col mx-8 mt-2">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <form
              action={`${backendUrl}${makeUrl('AdminsController.addons')}`}
              method="POST"
              className="space-y-2"
            >
              <Button type="submit" className="mb-2">
                Save
              </Button>
              <Table
                Header={Header}
                Tr={Row}
                data={(props.availableAddons as (Addon & {
                  id: string;
                })[]).map((addon) => {
                  addon.id = addon.getName();
                  return addon;
                })}
              />
            </form>
          </div>
        </div>
      </div>
    </Admin>
  );
}
