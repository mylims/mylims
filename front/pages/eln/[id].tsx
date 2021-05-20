import { useRouter } from 'next/router';

export default function EditConfig() {
  const router = useRouter();
  const { id } = router.query;
  return <>{id}</>;
}
