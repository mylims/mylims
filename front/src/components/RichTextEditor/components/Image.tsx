import clsx from 'clsx';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { RenderElementProps, useFocused, useSelected } from 'slate-react';

import { insertImage } from './header/ImageButton';
import { CustomEditor } from '../types';

interface ImageContextType {
  fetchImage?: (uuid: string) => string;
}
export const ImageContext = createContext<ImageContextType>({});

interface ImageProps {
  uuid: string;
  alt?: string;
  attributes: RenderElementProps['attributes'];
  children?: ReactNode;
}
export function Image({ uuid, alt, attributes, children }: ImageProps) {
  const { fetchImage } = useContext(ImageContext);
  const imageUrl = useMemo(() => fetchImage?.(uuid), [fetchImage, uuid]);
  const selected = useSelected();
  const focused = useFocused();

  if (!imageUrl) return <div>Error: image url not provided</div>;
  return (
    <div {...attributes}>
      {children}
      <div contentEditable={false}>
        <img
          src={imageUrl}
          alt={alt}
          className={clsx(selected && focused && 'ring-2 ring-primary-400')}
        />
      </div>
    </div>
  );
}

export function withImages(
  editor: CustomEditor,
  saveImage?: (file: File) => Promise<string>,
) {
  const { insertData, isVoid } = editor;

  editor.isVoid = (elm) => (elm.type === 'image' ? true : isVoid(elm));

  editor.insertData = (data) => {
    const { files } = data;

    if (files && files.length > 0) {
      for (const file of files) {
        if (saveImage) {
          saveImage(file)
            .then((url) => insertImage(editor, url))
            // eslint-disable-next-line no-console
            .catch((error) => console.error(error));
        } else {
          // eslint-disable-next-line no-console
          console.error('saveImage is not defined');
        }
      }
    } else {
      insertData(data);
    }
  };

  return editor;
}
