import { useRouter } from 'next/router';

import ElnLayout from '../../../../components/ElnLayout';
import { Alert, AlertType } from '../../../../components/tailwind-ui';
import TableFilesSync from '../../TableFilesSync';
import { useFilesByConfigQuery } from '../../generated/graphql';

export default function ListFiles() {
  const router = useRouter();
  const { id } = router.query;
  const { data, loading, error } = useFilesByConfigQuery({
    variables: { id: id as string, path: [] },
  });

  if (id === undefined) {
    void router.push('list');
    return null;
  }

  if (error) {
    return (
      <Alert
        title="Error while fetching file sync option"
        type={AlertType.ERROR}
      >
        Unexpected error {error.message}
      </Alert>
    );
  }

  return <TableFilesSync loading={loading} data={data} id={id as string} />;
}

ListFiles.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Table of synchronized files">{page}</ElnLayout>
);
