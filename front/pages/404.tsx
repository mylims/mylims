import { useRouter } from 'next/router';

import { PageNotFoundErrorPage } from '../components/tailwind-ui';

export default function Custom404() {
  const { asPath } = useRouter();
  return <PageNotFoundErrorPage url={asPath} />;
}
