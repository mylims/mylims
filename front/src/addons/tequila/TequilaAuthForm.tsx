import React from 'react';

import { API_URL } from '@/../env';
import { Button, Card } from '@/components/tailwind-ui';


export default function TequilaAuthForm() {
  const onConnect = () => {
    // ssr workaround
    if (window) {
      window.location.assign(`${API_URL}/addons/tequila/login`);
    }
  };

  return (
    <div className="min-w-1/4 m-4">
      <Card>
        <Card.Header>
          <h3 className="text-cool-gray-900 text-lg font-medium leading-6">
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
