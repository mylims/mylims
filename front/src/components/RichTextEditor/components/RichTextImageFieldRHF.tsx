import React from 'react';

import { API_URL } from '@/../env';
import { RichTextFieldRHF } from '@/components/RichTextEditor/components/RichTextFieldRHF';

interface RichTextImageFieldRHFProps {
  name: string;
  label: string;
}
export function RichTextImageFieldRHF({
  name,
  label,
}: RichTextImageFieldRHFProps) {
  return (
    <RichTextFieldRHF
      className="h-full max-w-7xl"
      name={name}
      label={label}
      fetchImage={(uuid) => `${API_URL}/files/fetchImage/${uuid}`}
      saveImage={async (file) => {
        let body = new FormData();
        body.append('file', file);
        const res = await fetch(`${API_URL}/files/createImage`, {
          method: 'POST',
          headers: { Accept: 'application/json' },
          body,
        });
        const [ok, result] = [res.ok, await res.json()];
        if (ok) return result._id;
        else throw new Error(result.errors[0].message);
      }}
    />
  );
}
