import { OidcConfig } from '@ioc:Zakodium/Oidc';

const oidcConfig: OidcConfig = {
  providers: [
    {
      identifier: 'azure',
      label: 'Azure AD',
      endpoints: {
        authorization:
          'https://login.microsoftonline.com/87839ca1-728a-473a-8c11-95dc39a51c30/oauth2/v2.0/authorize',
        keys: 'https://login.microsoftonline.com/common/discovery/keys',
      },
      clientId: '6cd84433-e0cd-4135-a3b6-6a2f523a1e7d',
    },
    {
      identifier: 'google',
      label: 'Google',
      endpoints: {
        authorization: 'https://accounts.google.com/o/oauth2/v2/auth',
        keys: 'https://www.googleapis.com/oauth2/v3/certs',
      },
      clientId:
        '479044963609-58osl9r7tc09fodjqgu4biud1vllmkon.apps.googleusercontent.com',
    },
  ],
};

export default oidcConfig;
