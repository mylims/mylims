import React from 'react';

import { useAdonisContext } from '@ioc:React';

import { ConfigProps } from 'App/AppConfig';

import { useBackendUrl } from '../hooks/useBackendUrl';
import Admin from '../layouts/Admin';
import { Card, Input, Button } from '../tailwind-ui';

export default function Config(props: { config: ConfigProps }) {
  const { makeUrl } = useAdonisContext();
  const backendUrl = useBackendUrl();

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
            <form
              action={makeUrl('AdminsController.changeConf', undefined, {
                prefixUrl: backendUrl,
              })}
              method="POST"
              className="space-y-2"
            >
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
                defaultValue={props.config.session.sessionAge}
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
            <form
              action={makeUrl('AdminsController.changeConf', undefined, {
                prefixUrl: backendUrl,
              })}
              method="POST"
              className="space-y-2"
            >
              <input
                type="hidden"
                id="confkey"
                name="confkey"
                defaultValue="mongodb"
              />
              <Input
                id="mongo-url"
                label="MongoDB URL"
                type="text"
                name="url"
                defaultValue={props.config.mongodb.url}
              />
              <Input
                id="database"
                label="MongoDB database"
                type="text"
                name="database"
                defaultValue={props.config.mongodb.database}
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
            <form
              action={makeUrl('AdminsController.changeConf', undefined, {
                prefixUrl: backendUrl,
              })}
              method="POST"
              className="space-y-2"
            >
              <input type="hidden" id="confkey" name="confkey" value="ldap" />
              <Input
                id="id"
                label="LDAP id"
                type="text"
                name="id"
                defaultValue={props.config.ldap.id}
              />
              <Input
                id="uid"
                label="LDAP uid"
                type="text"
                name="uid"
                defaultValue={props.config.ldap.uid}
              />
              <Input
                id="ldap-url"
                label="LDAP URL"
                type="text"
                name="url"
                defaultValue={props.config.ldap.url}
              />
              <Input
                id="appDN"
                label="LDAP DN"
                type="text"
                name="appDN"
                defaultValue={props.config.ldap.appDN}
              />
              <Input
                id="appPassword"
                label="LDAP password"
                type="text"
                name="appPassword"
                defaultValue={props.config.ldap.appPassword}
              />
              <Input
                id="baseUserDN"
                label="LDAP base user"
                type="text"
                name="baseUserDN"
                defaultValue={props.config.ldap.baseUserDN}
              />
              <Button type="submit">Update configuration</Button>
            </form>
          </Card.Body>
        </Card>

        {/* Tequila configuration */}
        <Card>
          <Card.Header>
            <h3 className="text-lg font-medium leading-6 text-neutral-900">
              Tequila
            </h3>
          </Card.Header>
          <Card.Body>
            <form
              action={makeUrl('AdminsController.changeConf', undefined, {
                prefixUrl: backendUrl,
              })}
              method="POST"
              className="space-y-2"
            >
              <input
                type="hidden"
                id="confkey"
                name="confkey"
                value="tequila"
              />
              <Input
                id="hostUrl"
                label="Tequila URL"
                type="text"
                name="hostUrl"
                defaultValue={props.config.tequila.hostUrl}
              />
              <Input
                id="groupName"
                label="Tequila group name"
                type="text"
                name="groupName"
                defaultValue={props.config.tequila.groupName}
              />
              <Button type="submit">Update configuration</Button>
            </form>
          </Card.Body>
        </Card>
      </div>
    </Admin>
  );
}
