import React from 'react';

import { useAdonisContext } from '@ioc:React';

import env from '../../../env';
import Admin from '../layouts/Admin';
import { Card, Button, Input } from '../tailwind-ui';

const backendUrl = env.BACKEND_URL;

export default function Login() {
  const {
    makeUrl,
    ctx: { session },
  } = useAdonisContext();

  return (
    <Admin>
      <div className="px-4 mx-auto mt-8 max-w-7xl sm:px-6 lg:px-12">
        <div className="max-w-xl mx-auto">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium leading-6 text-neutral-900">
                System configuration
              </h3>
            </Card.Header>
            <Card.Body>
              <form
                action={`${backendUrl}${makeUrl('AdminsController.auth')}`}
                method="POST"
                className="space-y-2"
              >
                <Input
                  label="Password"
                  id="password"
                  type="password"
                  name="password"
                  error={session.flashMessages.get('error')}
                />
                <Button type="submit">Login</Button>
              </form>
            </Card.Body>
          </Card>
        </div>
      </div>
    </Admin>
  );
}
