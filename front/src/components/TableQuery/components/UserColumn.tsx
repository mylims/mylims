import objectPath from 'object-path';
import React, { useEffect } from 'react';

import { SearchSelect, useSearchSelect } from '@/components/tailwind-ui';
import { UsersInputQuery, useUsersInputQuery } from '@/generated/graphql';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { BaseColumnProps, ColumnKind } from '../types';

import HeaderRender from './HeaderRender';

type UsersInput = UsersInputQuery['usersInput']['list']['0'];
interface UserSelection {
  id: string;
  firstName?: string;
  lastName?: string;
  email: string;
  username: string;
}

function fromInputToSelect(user: UsersInput): UserSelection {
  return {
    id: user.id,
    firstName: user.firstName ?? undefined,
    lastName: user.lastName ?? undefined,
    email: user.emails[0] ?? '-',
    username: user.usernames[0] ?? '-',
  };
}

export default function UserColumn({
  title,
  dataPath,
  queryPath,
  disableSearch = false,
  disableSort = false,
  nullable = false,
  index,
  children,
}: BaseColumnProps) {
  const { query, setQuery, submitQuery, dispatch } = useTableQueryContext();
  const path = queryPath ?? dataPath;
  const value = query[`${path}.value`] ?? '';
  const { data, loading, error } = useUsersInputQuery({
    variables: { input: value, limit: 3 },
  });
  const options = (data?.usersInput?.list ?? []).map(fromInputToSelect);
  const { onSelect, onSearchChange, ...searchSelect } =
    useSearchSelect<UserSelection>({
      options,
      filterOptions: (_, options) => options,
    });

  useEffect(() => {
    if (index === undefined) {
      throw new Error(`Index is not defined by the context for ${dataPath}`);
    }

    const render =
      children ??
      ((row) => {
        const input = objectPath(row).get(dataPath);
        if (!input) return '-';
        const user = fromInputToSelect(input);
        return <UserDetail user={user} />;
      });

    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        index,
        value: {
          dataPath,
          queryPath: path,
          disableSearch,
          disableSort,
          nullable,
          render,
        },
        kind: ColumnKind.USER,
        title: title.toLowerCase(),
      },
    });

    return () =>
      dispatch({
        type: 'REMOVE_COLUMN',
        payload: { title: title.toLowerCase() },
      });
  }, [
    dataPath,
    path,
    title,
    disableSearch,
    disableSort,
    nullable,
    index,
    children,
    dispatch,
  ]);

  if (disableSearch) {
    return <HeaderRender title={title} path={path} disableSort={disableSort} />;
  }

  return (
    <HeaderRender title={title} path={path} disableSort={disableSort}>
      <SearchSelect
        {...searchSelect}
        onSelect={(value: UserSelection | undefined) => {
          onSelect(value);
          if (value) {
            submitQuery({
              ...query,
              [`${path}.value`]: value.id,
              [`${path}.label`]: value.username,
              page: '1',
            });
          }
        }}
        onSearchChange={(value) => {
          setQuery({
            ...query,
            [`${path}.value`]: value,
            [`${path}.label`]: value,
          });
          onSearchChange(value);
        }}
        getValue={(option: UserSelection) => option.id}
        renderOption={(user: UserSelection) => <UserDetail user={user} />}
        label={path}
        loading={loading}
        error={error ? error.message : undefined}
        autoFocus
      />
    </HeaderRender>
  );
}

function UserDetail({ user }: { user: UserSelection }) {
  const name =
    [user.lastName?.toUpperCase(), user.firstName?.toLowerCase()]
      .filter((v) => !!v)
      .join(', ') ?? null;
  return (
    <div title={user.username}>
      <div className="text-base font-bold normal-case">{user.username}</div>
      {name && <div className="text-xs normal-case">{name}</div>}
      <div className="text-xs lowercase">{user.email}</div>
    </div>
  );
}
