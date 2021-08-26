import React, { useMemo } from 'react';

import ElnLayout from '@/components/ElnLayout';
import {
  Table,
  Spinner,
  Td,
  Th,
  Alert,
  AlertType,
} from '@/components/tailwind-ui';
import { useUsersQuery, UsersQuery } from '@/generated/graphql';

export default function Users() {
  const { loading, error, data } = useUsersQuery();

  return (
    <>
      {error && (
        <Alert title={'Error while fetching user'} type={AlertType.ERROR}>
          Unexpected error {error}
        </Alert>
      )}
      {loading ? (
        <Spinner className="w-10 h-10 text-danger-500" />
      ) : (
        <Table
          data={data?.users ?? []}
          Header={Header}
          Tr={Row}
          Empty={Empty}
        />
      )}
    </>
  );
}
Users.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;

function Header() {
  return (
    <tr>
      <Th>Name</Th>
      <Th>Emails</Th>
      <Th>Role</Th>
      <Th>Auth methods</Th>
    </tr>
  );
}

function Row(props: { value: UsersQuery['users'][number] }) {
  const [authMethodsKeys, authMethods] = useMemo(() => {
    const authMethods = props.value.authMethods ?? [];
    return [
      Object.keys(authMethods).filter(
        (authMethod) => !authMethod.startsWith('__'),
      ),
      authMethods,
    ];
  }, [props.value.authMethods]);

  return (
    <tr>
      <Td>{`${props.value.firstName || 'N/A'} ${
        props.value.lastName || 'N/A'
      }`}</Td>
      <Td>{props.value.emails.join(', ')}</Td>
      <Td>{props.value.role}</Td>
      <Td>
        {authMethodsKeys
          .filter((authMethodKey) => authMethods[authMethodKey] != null)
          .map((authMethodKey) => (
            <div key={authMethodKey}>
              {`${authMethodKey}: ${authMethods[authMethodKey] ?? 'N/A'}`}
              <br />
            </div>
          ))}
      </Td>
    </tr>
  );
}
function Empty() {
  return <h1>Empty</h1>;
}
