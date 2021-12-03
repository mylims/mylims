import ElnLayout from '@/components/ElnLayout';
import SampleDetail from '@/pages/samples/detail/Default';
import React from 'react';

export default function WaferDetail() {
  return <SampleDetail />;
}

WaferDetail.getLayout = (page: React.ReactNode) => {
  return <ElnLayout pageTitle="Sample detail">{page}</ElnLayout>;
};
