import { useRouter } from 'next/router';

import { PageNotFoundErrorPage } from '../components/tailwind-ui';

export default function Custom404() {
  const router = useRouter();
  return <PageNotFoundErrorPage url={router.asPath} />;
}
