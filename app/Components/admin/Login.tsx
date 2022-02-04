import React from 'react';

import { useAdonisContext } from '@ioc:React';

import { useBackendUrl } from '../hooks/useBackendUrl';
import Admin from '../layouts/Admin';
import { Card, Button, Input } from '../tailwind-ui';

export default function Login() {
  const {
    makeUrl,
    ctx: { session },
  } = useAdonisContext();
  const backendUrl = useBackendUrl();

  return (
    <Admin>
      <div className="mx-auto mt-8 max-w-7xl px-4 sm:px-6 lg:px-12">
        <div className="mx-auto max-w-xl">
          <Card>
            <Card.Header>
              <h3 className="text-lg font-medium leading-6 text-neutral-900">
                System configuration
              </h3>
            </Card.Header>
            <Card.Body>
              <form
                action={makeUrl('AdminsController.auth', undefined, {
                  prefixUrl: backendUrl,
                })}
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
