# contracts/auth.ts

```ts
import { LDAPProviderConfig } from '../addons/ldap/LDAPAuthProvider'
import { UserBuilder } from 'Providers/user/UserModel'

// provider list:
ldapUser: {
  implementation: UserProviderContract<ReturnType<typeof UserBuilder>>,
  config: LDAPProviderConfig,
},

// guards list:
ldap: {
  implementation: SessionGuardContract<'ldapUser', 'ldap'>,
  config: SessionGuardConfig<'ldapUser'>,
},
```

# config/auth.ts

```ts
const authConfig: AuthConfig = {
  guard: 'ldap',
  list: {
    /*
    |--------------------------------------------------------------------------
    | Web Guard
    |--------------------------------------------------------------------------
    |
    | Web guard uses classic old school sessions for authenticating users.
    | If you are building a standard web application, it is recommended to
    | use web guard with session driver
    |
    */
    ldap: {
      driver: 'session',
      provider: {
        driver: 'ldap',
        appDN: 'cn=admin,dc=example,dc=org',
        appPassword: 'adminpassword',
        baseUserDN: 'ou=users,dc=example,dc=org',
        uid: 'uid',
        id: 'uid',
        url: 'ldap://127.0.0.1:1389',
      },
    },
  },
};
```
