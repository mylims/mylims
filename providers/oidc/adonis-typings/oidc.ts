declare module '@ioc:Zakodium/Oidc' {
  export interface OidcProviderConfig {
    identifier: string;
    label: string;
    endpoints: { authorization: string; keys: string };
    clientId: string;
  }
  export interface OidcConfig {
    providers: OidcProviderConfig[];
  }
  export interface OidcState {
    redirectTo: string;
    provider: string;
  }
  export interface OidcContract {
    availableProviders: Pick<OidcProviderConfig, 'identifier' | 'label'>[];
    login(provider: string): void;
    callback<T extends { [key: string]: string | undefined }>(): Promise<
      [content: T, state: OidcState]
    >;
  }
}
