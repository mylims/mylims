import { Leaf, Element } from '@/components/RichTextEditor';
import { ImageContext } from '@/components/RichTextEditor/Image';
import React, { ReactNode } from 'react';
import { Descendant, Text } from 'slate';

interface RichTextSerializerProps {
  className?: string;
  value: Descendant[];
  fetchImage?: (uuid: string) => string;
}
export function RichTextSerializer({
  className,
  value,
  fetchImage,
}: RichTextSerializerProps) {
  const children = value.map((n) => serialize(n));
  return (
    <ImageContext.Provider value={{ fetchImage }}>
      <div className={className}>{children}</div>
    </ImageContext.Provider>
  );
}

function serialize(node: Descendant): ReactNode {
  if (Text.isText(node)) {
    return (
      <Leaf
        leaf={node}
        text={node}
        attributes={{
          'data-slate-leaf': true,
        }}
      >
        {node.text}
      </Leaf>
    );
  }

  const children = node.children.map((n) => serialize(n));

  return (
    <Element
      element={node}
      attributes={{
        'data-slate-node': 'element',
        ref: undefined,
      }}
    >
      {children}
    </Element>
  );
}
