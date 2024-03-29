import { useFormikContext } from 'formik';
import React, { useEffect } from 'react';

export default function AutoSubmitForm() {
  const { submitForm, values } = useFormikContext();

  useEffect(() => {
    const handler = setTimeout(() => {
      // eslint-disable-next-line no-console
      submitForm().catch((error) => console.error(error));
    }, 1000);
    return () => clearTimeout(handler);
  }, [submitForm, values]);
  return <div />;
}
