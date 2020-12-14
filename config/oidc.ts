import { OidcConfig } from '@ioc:Zakodium/Oidc';

const oidcConfig: OidcConfig = {
  providers: [
    {
      identifier: 'azure',
      label: 'Azure AD',
      endpoints: {
        authorization:
          'https://login.microsoftonline.com/87839ca1-728a-473a-8c11-95dc39a51c30/oauth2/v2.0/authorize',
      },
      clientId: '6cd84433-e0cd-4135-a3b6-6a2f523a1e7d',
    },
  ],
};

export default oidcConfig;
