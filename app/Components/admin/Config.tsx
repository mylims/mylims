import React from 'react';

import { useAdonisContext } from '@ioc:React';

import { ConfigProps } from 'App/AppConfig';

import Button from '../Button';
import Card from '../Card';
import Input from '../Input';
import Admin from '../layouts/Admin';

export default function Config(props: { config: ConfigProps }) {
  const { makeUrl } = useAdonisContext();
  return (
    <Admin>
      <div className="grid gap-10 mx-6 mt-12 lg:grid-cols-3 lg:max-w-none">
        <Card title="Session">
          <form action={makeUrl('AdminsController.changeConf')} method="POST">
            <input type="hidden" id="confkey" name="confkey" value="session" />
            <Input
              id="sessionAge"
              label="Session age"
              type="text"
              name="sessionAge"
              value={props.config.session.sessionAge}
            />
            <Button label="Update configuration" type="submit" />
          </form>
        </Card>
        <Card title="MongoDb">
          <form action={makeUrl('AdminsController.changeConf')} method="POST">
            <input type="hidden" id="confkey" name="confkey" value="mongodb" />
            <Input
              id="mongo-url"
              label="MongoDB URL"
              type="text"
              name="url"
              value={props.config.mongodb.url}
            />
            <Input
              id="database"
              label="MongoDB database"
              type="text"
              name="database"
              value={props.config.mongodb.database}
            />
            <Button label="Update configuration" type="submit" />
          </form>
        </Card>
        <Card title="LDAP">
          <form action={makeUrl('AdminsController.changeConf')} method="POST">
            <input type="hidden" id="confkey" name="confkey" value="ldap" />

            <Input
              id="id"
              label="LDAP id"
              type="text"
              name="id"
              value={props.config.ldap.id}
            />
            <Input
              id="uid"
              label="LDAP uid"
              type="text"
              name="uid"
              value={props.config.ldap.uid}
            />
            <Input
              id="ldap-url"
              label="LDAP URL"
              type="text"
              name="ldap-url"
              value={props.config.ldap.url}
            />
            <Input
              id="appDN"
              label="LDAP DN"
              type="text"
              name="appDN"
              value={props.config.ldap.appDN}
            />
            <Input
              id="appPassword"
              label="LDAP password"
              type="text"
              name="appPassword"
              value={props.config.ldap.appPassword}
            />
            <Input
              id="baseUserDN"
              label="LDAP base user"
              type="text"
              name="baseUserDN"
              value={props.config.ldap.baseUserDN}
            />
            <Button label="Update configuration" type="submit" />
          </form>
        </Card>
      </div>
    </Admin>
  );
}
