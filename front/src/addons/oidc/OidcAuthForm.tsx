import React, { useCallback, useState } from 'react';

import { API_URL } from '@/../env';
import { Button, Card, Select } from '@/components/tailwind-ui';
import { useElnQuery } from '@/hooks/useElnQuery';


interface ProviderData {
  identifier: string;
  label: string;
}

export default function OidcAuthForm() {
  const { data: providersData = [] } = useElnQuery('/addons/oidc/providers');
  const [selectedOidcProvider, selectOidcProvider] = useState<
    string | undefined
  >(undefined);
  const onConnect = useCallback(() => {
    // ssr workaround
    if (window && selectedOidcProvider) {
      window.location.assign(
        `${API_URL}/addons/oidc/login?oidcProvider=${selectedOidcProvider}`,
      );
    }
  }, [selectedOidcProvider]);

  return (
    <div className="min-w-1/4 m-4">
      <Card>
        <Card.Header>
          <h3 className="text-cool-gray-900 text-lg font-medium leading-6">
            OpenID Connect provider
          </h3>
        </Card.Header>
        <div className="p-4">
          <Select<ProviderData>
            selected={providersData.find(
              (provider: ProviderData) =>
                provider.identifier === selectedOidcProvider,
            )}
            options={providersData}
            renderOption={(option) => option.label}
            getValue={(option) => option.identifier}
            onSelect={(option) => selectOidcProvider(option?.identifier)}
            className="mb-4"
          />
          <Button
            onClick={onConnect}
            disabled={selectedOidcProvider === undefined}
          >
            Connect
          </Button>
        </div>
      </Card>
    </div>
  );
}
