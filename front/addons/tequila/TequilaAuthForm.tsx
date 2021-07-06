import React, { useCallback, useState } from 'react';

import { Button, Card, Select } from '../../components/tailwind-ui';
import { API_URL } from '../../env';
import { useElnQuery } from '../../hooks/useElnQuery';

interface ProviderData {
  identifier: string;
  label: string;
}

export default function TequilaAuthForm() {
  const onConnect = () => {
    // ssr workaround
    if (window) {
      window.location.assign(`${API_URL}/addons/tequila/login`);
    }
  };

  return (
    <div className="m-4 min-w-1/4">
      <Card>
        <Card.Header>
          <h3 className="text-lg font-medium leading-6 text-cool-gray-900">
            Tequila login
          </h3>
        </Card.Header>
        <div className="p-4">
          <Button onClick={onConnect}>Connect</Button>
        </div>
      </Card>
    </div>
  );
}
