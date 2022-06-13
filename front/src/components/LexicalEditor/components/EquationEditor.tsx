import * as React from 'react';
import { ChangeEvent, RefObject } from 'react';

interface BaseEquationEditorProps {
  equation: string;
  inline: boolean;
  inputRef: { current: null | HTMLInputElement | HTMLTextAreaElement };
  setEquation: (val: string) => void;
}

export default function EquationEditor({
  equation,
  setEquation,
  inline,
  inputRef,
}: BaseEquationEditorProps): JSX.Element {
  const onChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setEquation(event.target.value);
  };

  const props = { equation, inputRef, onChange };

  return inline ? (
    <InlineEquationEditor
      {...props}
      inputRef={inputRef as RefObject<HTMLInputElement>}
    />
  ) : (
    <BlockEquationEditor
      {...props}
      inputRef={inputRef as RefObject<HTMLTextAreaElement>}
    />
  );
}

interface EquationEditorImplProps {
  equation: string;
  inputRef: { current: null | HTMLInputElement };
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

function InlineEquationEditor({
  equation,
  onChange,
  inputRef,
}: EquationEditorImplProps): JSX.Element {
  return (
    <span className="bg-neutral-100 p-2">
      <span className="text-left text-neutral-500">$</span>
      <input
        className="text-alternative-700 resize-none bg-inherit outline-none"
        value={equation}
        onChange={onChange}
        autoFocus
        ref={inputRef}
      />
      <span className="text-left text-neutral-500">$</span>
    </span>
  );
}

interface BlockEquationEditorImplProps {
  equation: string;
  inputRef: { current: null | HTMLTextAreaElement };
  onChange: (event: ChangeEvent<HTMLTextAreaElement>) => void;
}

function BlockEquationEditor({
  equation,
  onChange,
  inputRef,
}: BlockEquationEditorImplProps): JSX.Element {
  return (
    <div className="bg-neutral-100 p-2">
      <span className="text-left text-neutral-500">{'$$\n'}</span>
      <textarea
        className="text-alternative-700 resize-none w-full bg-inherit outline-none"
        value={equation}
        onChange={onChange}
        ref={inputRef}
      />
      <span className="text-left text-neutral-500">{'\n$$'}</span>
    </div>
  );
}
