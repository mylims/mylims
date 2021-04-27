import { useAdonisContext } from '@ioc:React';

export function useBackendUrl() {
  const {
    app: { env },
  } = useAdonisContext();

  return env.get('BACKEND_URL');
}
