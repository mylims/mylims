import { useHistory } from 'react-router-dom';
import pMinDelay from 'p-min-delay';
import React, { useContext, useEffect } from 'react';

import LocalAuthForm from '@components/LocalAuthForm';
import AddonsContext from '../contexts/AddonsContext';
import useAuth from '../hooks/useAuth';

const loginAddons = {
  ldap: () => pMinDelay(import('../addons/ldap/LdapAuthForm'), 1000),
  oidc: () => pMinDelay(import('../addons/oidc/OidcAuthForm'), 1000),
  tequila: () => pMinDelay(import('../addons/tequila/TequilaAuthForm'), 1000),
};

type AddonsKeys = keyof typeof loginAddons;

export default function Login() {
  const addons = useContext(AddonsContext);
  const auth = useAuth();
  const router = useHistory();

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
