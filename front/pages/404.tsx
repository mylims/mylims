import { useRouter } from 'next/router';

import ElnLayout from '../components/ElnLayout';
import { PageNotFoundErrorPage } from '../components/tailwind-ui';

export default function Custom404() {
  const router = useRouter();
  return <PageNotFoundErrorPage url={router.asPath} />;
}

Custom404.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Path not found">{page}</ElnLayout>
);
