import { useRouter } from 'next/router';

import ElnLayout from '../../../../components/ElnLayout';
import { Alert, AlertType, Spinner } from '../../../../components/tailwind-ui';
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

  if (loading) return <Spinner className="w-10 h-10 text-danger-500" />;
  if (error) {
    return (
      <Alert
        title={'Error while fetching file sync option'}
        type={AlertType.ERROR}
      >
        Unexpected error {error.message}
      </Alert>
    );
  }

  return <TableFilesSync data={data} id={id as string} />;
}

ListFiles.getLayout = (page: React.ReactNode) => (
  <ElnLayout pageTitle="Table of synchronized files">{page}</ElnLayout>
);
