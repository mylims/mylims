declare module '@ioc:Zakodium/Oidc' {
  export interface OidcState {
    redirectTo: string;
  }
  export interface OidcContract {
    login(): void;
    callback<T extends { [key: string]: string }>(): Promise<
      [content: T, state: OidcState]
    >;
  }
}
