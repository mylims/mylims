declare module '@ioc:Zakodium/Auth' {
  export interface AuthConfig {
    defaultProvider: string;
    providers: Record<string, unknown>;
  }
}
