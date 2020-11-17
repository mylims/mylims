import React from 'react';

import { StoreContract } from '@ioc:Adonis/Addons/Session';
import { RequestContract } from '@ioc:Adonis/Core/Request';

import Button from '../Button';
import Card from '../Card';
import Input from '../Input';
import Admin from '../layouts/Admin';

export default function Login(props: {
  request: RequestContract;
  route: (routeIdentifier: string) => string;
  flashMessages: StoreContract;
}) {
  return (
    <Admin request={props.request}>
      <div className="px-4 mx-auto mt-8 max-w-7xl sm:px-6 lg:px-12">
        <div className="max-w-xl mx-auto">
          <form action={props.route('AdminsController.auth')} method="POST">
            <Card title="System configuration">
              <Input
                label="Password"
                id="password"
                type="password"
                name="password"
                error={props.flashMessages.get('error')}
              />
              <Button type="submit" label="Login" />
            </Card>
          </form>
        </div>
      </div>
    </Admin>
  );
}
