import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import useAuth from '../hooks/useAuth';
import { useElnMutation } from '../hooks/useElnQuery';

import { Form, InputField, SubmitButton, FormError, Card } from './tailwind-ui';

const initialValues = {
  email: '',
  password: '',
};

interface ILogin {
  email: string;
  password: string;
}

export default function LocalAuthForm() {
  const authMutation = useElnMutation('/auth/local');
  const navigate = useNavigate();
  const auth = useAuth();

  const handleSubmit = useCallback(
    async (values: ILogin) => {
      const result = await authMutation.mutateAsync(values);
      if (result.email && result.role) {
        auth.email = result.email;
        auth.role = result.role;
        auth.username = result.username;
        auth.id = result.id;
        auth.isAuth = true;
        return navigate('/measurement/list');
      }
    },
    [auth, navigate, authMutation],
  );

  return (
    <div className="min-w-1/4 m-4">
      <Card>
        <Card.Header>
          <h3 className="text-cool-gray-900 text-lg font-medium leading-6">
            Local provider
          </h3>
        </Card.Header>
        <div className="p-4">
          <Form initialValues={initialValues} onSubmit={handleSubmit}>
            <FormError />
            <InputField name="email" label="Email" />
            <InputField name="password" label="Password" type="password" />
            <SubmitButton>Submit</SubmitButton>
          </Form>
        </div>
      </Card>
    </div>
  );
}
