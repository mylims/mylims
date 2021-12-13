import React from 'react';
import { useLocation } from 'react-router-dom';

import ElnLayout from '@/components/ElnLayout';
import { PageNotFoundErrorPage } from '@/components/tailwind-ui';

export default function Custom404() {
  const { pathname } = useLocation();
  return <PageNotFoundErrorPage url={pathname} />;
}

Custom404.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
