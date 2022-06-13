import katex from 'katex';
import React, { useEffect, useRef } from 'react';

interface KatexRendererProps {
  equation: string;
  inline: boolean;
  onClick: () => void;
}
export default function KatexRenderer({
  equation,
  inline,
  onClick,
}: Readonly<KatexRendererProps>): JSX.Element {
  const katexElementRef = useRef(null);

  useEffect(() => {
    const katexElement = katexElementRef.current;

    if (katexElement !== null) {
      katex.render(equation, katexElement, {
        displayMode: !inline,
        errorColor: '#cc0000',
        output: 'html',
        strict: 'warn',
        throwOnError: false,
        trust: false,
      });
    }
  }, [equation, inline]);

  return (
    // We use spacers either side to ensure Android doesn't try and compose from the
    // inner text from Katex. There didn't seem to be any other way of making this work,
    // without having a physical space.
    <>
      <span className="tracking-[-0.1rem]"> </span>
      <span
        role="button"
        tabIndex={-1}
        onClick={onClick}
        ref={katexElementRef}
      />
      <span className="tracking-[-0.1rem]"> </span>
    </>
  );
}
