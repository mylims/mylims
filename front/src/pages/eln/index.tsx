import React from 'react';

import ElnLayout from '@components/ElnLayout';


export default function ElnIndex() {
  return <>Dashboard</>;
}

ElnIndex.getLayout = (page: React.ReactNode) => <ElnLayout>{page}</ElnLayout>;
