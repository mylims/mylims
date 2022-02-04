import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import LocalAuthForm from '@/components/LocalAuthForm';

import AddonsContext from '../contexts/AddonsContext';
import useAuth from '../hooks/useAuth';

const loginAddons = {
  ldap: () => import('../addons/ldap/LdapAuthForm'),
  oidc: () => import('../addons/oidc/OidcAuthForm'),
  tequila: () => import('../addons/tequila/TequilaAuthForm'),
};

type AddonsKeys = keyof typeof loginAddons;

export default function Login() {
  const addons = useContext(AddonsContext);
  const [addonsList, setAddonsList] = useState<React.ReactNode[]>([]);
  const auth = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (auth.isAuth) void navigate('/measurement/list');
  }, [auth.isAuth, navigate]);

  useEffect(() => {
    const definedAddons = addons.filter(
      (addon) => loginAddons[addon as AddonsKeys] !== undefined,
    );
    const promises = definedAddons.map((addon) =>
      loginAddons[addon as AddonsKeys](),
    );
    Promise.all(promises)
      .then((list) =>
        setAddonsList(
          list.map((module, i) => {
            const Module = module.default;
            return <Module key={definedAddons[i]} />;
          }),
        ),
      )
      .catch(() => setAddonsList([]));
  }, [addons]);

  return (
    <>
      <h2 className="text-gray-900 mt-6 text-center text-3xl font-extrabold leading-9">
        New-eln login
      </h2>
      <div className="flex flex-wrap justify-around">
        <LocalAuthForm />
        {addonsList}
      </div>
    </>
  );
}
