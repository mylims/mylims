import { useHistory } from 'react-router-dom';
import React, { useCallback } from 'react';

import {
  Form,
  InputField,
  SubmitButton,
  FormError,
  Card,
} from '@components/tailwind-ui';
import useAuth from '../../hooks/useAuth';
import { useElnMutation } from '../../hooks/useElnQuery';

const initialValues = {
  uid: '',
  password: '',
};

interface ILogin {
  uid: string;
  password: string;
}

export default function LdapAuthForm() {
  const authMutation = useElnMutation('/addons/ldap/login');
  const router = useHistory();
  const auth = useAuth();

  const handleSubmit = useCallback(
    async (values: ILogin) => {
      const result = await authMutation.mutateAsync(values);
      if (result.email && result.role) {
        auth.email = result.email;
        auth.role = result.role;
        auth.isAuth = true;
        return router.push('/eln');
      }
    },
    [auth, router, authMutation],
  );

  return (
    <div className="m-4 min-w-1/4">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium leading-6 text-cool-gray-900">
            LDAP provider
          </h3>
        </Card.Header>
        <div className="p-4">
          <Form initialValues={initialValues} onSubmit={handleSubmit}>
            <FormError />
            <InputField name="uid" label="UID" />
            <InputField name="password" label="Password" type="password" />
            <SubmitButton>Submit</SubmitButton>
          </Form>
        </div>
      </Card>
    </div>
  );
}
