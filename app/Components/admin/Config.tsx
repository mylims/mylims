import React from 'react';

import { useAdonisContext } from '@ioc:React';

import { ConfigProps } from 'App/AppConfig';

import Admin from '../layouts/Admin';
import { Card, Input, Button } from '../tailwind-ui';

export default function Config(props: { config: ConfigProps }) {
  const { makeUrl } = useAdonisContext();
  return (
    <Admin>
      <div className="grid gap-10 mx-6 mt-12 lg:grid-cols-3 lg:max-w-none">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium leading-6 text-neutral-900">
              Session
            </h3>
          </Card.Header>
          <Card.Body>
            <form action={makeUrl('AdminsController.changeConf')} method="POST">
              <input
                type="hidden"
                id="confkey"
                name="confkey"
                value="session"
              />
              <Input
                id="sessionAge"
                label="Session age"
                type="text"
                name="sessionAge"
                value={props.config.session.sessionAge}
                className="mb-2"
              />
              <Button type="submit">Update configuration</Button>
            </form>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium leading-6 text-neutral-900">
              MongoDB
            </h3>
          </Card.Header>
          <Card.Body>
            <form action={makeUrl('AdminsController.changeConf')} method="POST">
              <input
                type="hidden"
                id="confkey"
                name="confkey"
                value="mongodb"
              />
              <Input
                id="mongo-url"
                label="MongoDB URL"
                type="text"
                name="url"
                value={props.config.mongodb.url}
                className="mb-2"
              />
              <Input
                id="database"
                label="MongoDB database"
                type="text"
                name="database"
                value={props.config.mongodb.database}
                className="mb-2"
              />
              <Button type="submit">Update configuration</Button>
            </form>
          </Card.Body>
        </Card>
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium leading-6 text-neutral-900">
              LDAP
            </h3>
          </Card.Header>
          <Card.Body>
            <form action={makeUrl('AdminsController.changeConf')} method="POST">
              <input type="hidden" id="confkey" name="confkey" value="ldap" />
              <Input
                id="id"
                label="LDAP id"
                type="text"
                name="id"
                value={props.config.ldap.id}
                className="mb-2"
              />
              <Input
                id="uid"
                label="LDAP uid"
                type="text"
                name="uid"
                value={props.config.ldap.uid}
                className="mb-2"
              />
              <Input
                id="ldap-url"
                label="LDAP URL"
                type="text"
                name="url"
                value={props.config.ldap.url}
                className="mb-2"
              />
              <Input
                id="appDN"
                label="LDAP DN"
                type="text"
                name="appDN"
                value={props.config.ldap.appDN}
                className="mb-2"
              />
              <Input
                id="appPassword"
                label="LDAP password"
                type="text"
                name="appPassword"
                value={props.config.ldap.appPassword}
                className="mb-2"
              />
              <Input
                id="baseUserDN"
                label="LDAP base user"
                type="text"
                name="baseUserDN"
                value={props.config.ldap.baseUserDN}
                className="mb-2"
              />
              <Button type="submit">Update configuration</Button>
            </form>
          </Card.Body>
        </Card>
      </div>
    </Admin>
  );
}
