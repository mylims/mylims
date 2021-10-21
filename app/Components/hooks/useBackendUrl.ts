import { useAdonisContext } from '@ioc:React';

export function useBackendUrl() {
  const { app } = useAdonisContext();
  return app.env.get('BACKEND_URL');
}
