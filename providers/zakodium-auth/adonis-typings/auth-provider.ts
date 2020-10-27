declare module '@ioc:Zakodium/Auth' {
  export interface GenericAuthProvider {
    attempt<T>(uid: string, password: string): Promise<T | null>;
  }
}
