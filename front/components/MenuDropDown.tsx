import { useRouter } from 'next/router';
import React, { useMemo } from 'react';

import useAuth from '../hooks/useAuth';
import { useElnMutation } from '../hooks/useElnQuery';

import { Dropdown, DropdownElement, DropdownOption } from './tailwind-ui';

interface DropdownCustoms {
  onClick: () => Promise<void>;
}

export default function MenuDropDown(): JSX.Element {
  const auth = useAuth();
  const router = useRouter();

  const logoutQuery = useElnMutation('/auth/logout');

  const options: DropdownElement<DropdownCustoms>[][] = useMemo(
    () => [
      [
        {
          type: 'static',
          content: (
            <>
              <p>Signed in as</p>
              <p>{auth.email}</p>
            </>
          ),
        },
      ],
      [
        {
          label: 'Logout',
          type: 'option',
          data: {
            onClick: () =>
              logoutQuery.mutateAsync({}).then(() => {
                auth.isAuth = false;
                // eslint-disable-next-line no-console
                router.push('/login').catch((err) => console.log(err));
              }),
          },
        },
      ],
    ],
    [auth, logoutQuery, router],
  );

  function handleClick(selected: DropdownOption<DropdownCustoms>) {
    // eslint-disable-next-line no-console
    selected.data?.onClick().catch((err) => console.log(err));
  }

  return (
    <div className="ml-52">
      <Dropdown onSelect={handleClick} options={options} title="Menu">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
        </svg>
      </Dropdown>
    </div>
  );
}
