declare module '@ioc:Zakodium/Auth' {
  export interface GenericAuthProvider {
    attempt(uid: string, password: string): Promise<unknown | null>;
  }
}
