import React from 'react';

import ElnLayout from './_layout';

export default function ElnIndex() {
  return <>Dashboard</>;
}

ElnIndex.getLayout = (page) => <ElnLayout>{page}</ElnLayout>;
