import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';

interface SampleLinkProps {
  nodeKey: string;
}
export function SampleLink({ nodeKey }: SampleLinkProps) {
  const wrapperRef = useRef<HTMLAnchorElement>(null);
  const [state, setState] = useState<DOMRect | null>(null);
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    const element = editor.getElementByKey(nodeKey);
    if (element) {
      const boundaries = element.getBoundingClientRect();
      setState(boundaries);
    }
  }, [editor, nodeKey]);

  if (!state) return null;
  return (
    <Link
      ref={wrapperRef}
      style={{
        position: 'absolute',
        top: state.top,
        left: state.left,
      }}
      to="/sample"
    >
      test
    </Link>
  );
}
