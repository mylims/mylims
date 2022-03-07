import clsx from 'clsx';
import React, { createContext, ReactNode, useContext, useMemo } from 'react';
import { RenderElementProps, useFocused, useSelected } from 'slate-react';

import { insertImage } from './header/ImageButton';
import { CustomEditor } from './types';

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

export function withImages(editor: CustomEditor) {
  const { insertData, isVoid } = editor;

  editor.isVoid = (element) => {
    return element.type === 'image' ? true : isVoid(element);
  };

  editor.insertData = (data) => {
    const text = data.getData('text/plain');

    if (text) {
      insertImage(editor, text);
    } else {
      insertData(data);
    }
  };

  return editor;
}