declare module '@ioc:Adonis/Core/Env' {
  type CustomTypes = typeof import('../env').default;
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface EnvTypes extends CustomTypes {}
}
