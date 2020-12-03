import React from 'react';

import { useAdonisContext } from '@ioc:React';

import type { Addon } from 'App/AddonsManager';

import Button from '../Button';
import Admin from '../layouts/Admin';

export default function AddonPage(props: { availableAddons: Addon[] }) {
  const { makeUrl } = useAdonisContext();
  return (
    <Admin>
      <div className="flex flex-col mx-8">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <div className="overflow-hidden border-b shadow border-neutral-200 sm:rounded-lg">
              <form action={makeUrl('AdminsController.addons')} method="POST">
                <Button label="Save" type="submit" />
                <table className="min-w-full mt-2 divide-y divide-neutral-200">
                  <thead>
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
                  </thead>
                  <tbody>
                    {props.availableAddons.map((addon, index) => (
                      <tr
                        key={index}
                        className={
                          index % 2 === 1 ? 'bg-neutral-50' : 'bg-white'
                        }
                      >
                        <td className="px-6 py-4 text-sm font-medium leading-5 whitespace-no-wrap text-neutral-900">
                          {addon.getDisplayName()}
                        </td>
                        <td className="px-6 py-4 text-sm leading-5 whitespace-no-wrap text-neutral-500">
                          {addon.getDescription()}
                        </td>
                        <td className="px-6 py-4 text-sm leading-5 whitespace-no-wrap text-neutral-500">
                          <div className="flex items-center h-5">
                            <input
                              id={addon.getName()}
                              name={addon.getName()}
                              defaultChecked={addon.isEnabled}
                              type="checkbox"
                              className="w-4 h-4 transition duration-150 ease-in-out form-checkbox text-alternative-600"
                            />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>
            </div>
          </div>
        </div>
      </div>
    </Admin>
  );
}
