import React from 'react';

import { useAdonisContext } from '@ioc:React';

import Button from '../Button';
import Card from '../Card';
import Input from '../Input';
import Admin from '../layouts/Admin';

export default function Login() {
  const {
    makeUrl,
    ctx: { session },
  } = useAdonisContext();
  return (
    <Admin>
      <div className="px-4 mx-auto mt-8 max-w-7xl sm:px-6 lg:px-12">
        <div className="max-w-xl mx-auto">
          <form action={makeUrl('AdminsController.auth')} method="POST">
            <Card title="System configuration">
              <Input
                label="Password"
                id="password"
                type="password"
                name="password"
                error={session.flashMessages.get('error')}
              />
              <Button type="submit" label="Login" />
            </Card>
          </form>
        </div>
      </div>
    </Admin>
  );
}
