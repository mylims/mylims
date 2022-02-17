import { Leaf, Element } from '@/components/RichTextEditor';
import React, { ReactNode } from 'react';
import { Descendant, Text } from 'slate';

interface RichTextSerializerProps {
  className?: string;
  value: Descendant[];
}
export function RichTextSerializer({
  className,
  value,
}: RichTextSerializerProps) {
  const children = value.map((n) => serialize(n));
  return <div className={className}>{children}</div>;
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
