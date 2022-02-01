import React, { useCallback, useMemo } from 'react';
import clsx from 'clsx';
import isHotkey from 'is-hotkey';
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';

import { inputColor } from '@/components/tailwind-ui/forms/basic/common';

import { BlockButton } from './header/BlockButton';
import { MarkButton, MarkFormat, toggleMark } from './header/MarkButton';

const HOTKEYS: Record<string, MarkFormat> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

interface RichTextEditorProps {
  value: Descendant[];
  onChange(value: Descendant[]): void;
}
export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(() => withHistory(withReact(createEditor())), []);

  return (
    <div
      className={clsx(
        'px-3 py-2 border rounded-md shadow-sm focus-within:ring-1',
        inputColor,
      )}
    >
      <Slate
        editor={editor}
        value={value}
        onChange={(value) => onChange(value)}
      >
        <div className="grid grid-cols-8 gap-2 py-2 mb-2 border-b-2 border-neutral-300">
          <MarkButton format="bold" icon="format_bold" />
          <MarkButton format="italic" icon="format_italic" />
          <MarkButton format="underline" icon="format_underlined" />
          <BlockButton format="heading-one" icon="looks_one" />
          <BlockButton format="heading-two" icon="looks_two" />
          <BlockButton format="numbered-list" icon="format_list_numbered" />
          <BlockButton format="bulleted-list" icon="format_list_bulleted" />
        </div>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some text…"
          spellCheck
          autoFocus
          onKeyDown={(event) => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event as any)) {
                event.preventDefault();
                const mark = HOTKEYS[hotkey];
                toggleMark(editor, mark);
              }
            }
          }}
        />
      </Slate>
    </div>
  );
}

function Element({ attributes, children, element }: RenderElementProps) {
  switch (element.type) {
    case 'bulleted-list':
      return (
        <ul className="list-disc list-inside" {...attributes}>
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol className="list-decimal list-inside" {...attributes}>
          {children}
        </ol>
      );
    case 'heading-one':
      return (
        <h1
          className="text-2xl font-bold leading-tight text-neutral-900"
          {...attributes}
        >
          {children}
        </h1>
      );
    case 'heading-two':
      return (
        <h2
          className="text-xl font-bold leading-tight text-neutral-800"
          {...attributes}
        >
          {children}
        </h2>
      );
    case 'list-item':
      return <li {...attributes}>{children}</li>;
    default:
      return <p {...attributes}>{children}</p>;
  }
}

function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return <span {...attributes}>{children}</span>;
}
