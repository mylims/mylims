import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';
import pMinDelay from 'p-min-delay';
import React, { useContext, useEffect } from 'react';

import LocalAuthForm from '../components/LocalAuthForm';
import { Spinner, Card } from '../components/tailwind-ui';
import AddonsContext from '../contexts/AddonsContext';
import useAuth from '../hooks/useAuth';

const spinner = (
  <div className="m-4 min-w-1/4">
    <Card>
      <div className="flex items-center justify-center w-full h-full m-4">
        <Spinner className="w-10 h-10 text-danger-500" />
      </div>
    </Card>
  </div>
);

const loginAddons = {
  ldap: dynamic(() => pMinDelay(import('../addons/ldap/LdapAuthForm'), 1000), {
    loading: () => spinner,
  }),
  oidc: dynamic(() => pMinDelay(import('../addons/oidc/OidcAuthForm'), 1000), {
    loading: () => spinner,
  }),
  tequila: dynamic(
    () => pMinDelay(import('../addons/tequila/TequilaAuthForm'), 1000),
    { loading: () => spinner },
  ),
};

type AddonsKeys = keyof typeof loginAddons;

export default function Login() {
  const addons = useContext(AddonsContext);
  const auth = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (auth.isAuth) {
      void router.push('/eln');
    }
  }, [auth.isAuth, router]);

  return (
    <>
      <h2 className="mt-6 text-3xl font-extrabold leading-9 text-center text-gray-900">
        New-eln login
      </h2>
      <div className="flex flex-wrap justify-around">
        <LocalAuthForm />
        {addons
          .filter((addon) => loginAddons[addon as AddonsKeys] !== undefined)
          .map((addon) => [addon, loginAddons[addon as AddonsKeys]])
          .map(([addon, AddonComponent]) => (
            <AddonComponent key={addon as string} />
          ))}
      </div>
    </>
  );
}
