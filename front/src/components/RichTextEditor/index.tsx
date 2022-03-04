import clsx from 'clsx';
import { isHotkey } from 'is-hotkey';
import React, { CSSProperties, useCallback, useMemo } from 'react';
import { useDropzone } from 'react-dropzone';
import { createEditor, Descendant } from 'slate';
import { withHistory } from 'slate-history';
import {
  Editable,
  withReact,
  Slate,
  RenderElementProps,
  RenderLeafProps,
} from 'slate-react';

import ImageButton, {
  insertImage,
} from '@/components/RichTextEditor/header/ImageButton';
import {
  Help,
  inputColor,
  inputError,
  inputValid,
  Label,
} from '@/components/tailwind-ui/forms/basic/common';

import { Image, ImageContext, withImages } from './Image';
import { BlockButton } from './header/BlockButton';
import { MarkButton, MarkFormat, toggleMark } from './header/MarkButton';

const HOTKEYS: Record<string, MarkFormat> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
};

export interface RichTextEditorProps {
  value: Descendant[];
  onChange(value: Descendant[]): void;
  className?: string;
  style?: CSSProperties;
  id?: string;
  name: string;
  label: string;
  hiddenLabel?: boolean;
  required?: boolean;
  error?: string;
  help?: string;
  valid?: boolean | string;
  fetchImage?: (uuid: string) => string;
  saveImage?: (file: File) => Promise<string>;
}
export function RichTextEditor({
  value: initialValue,
  onChange,
  className,
  style,
  name,
  id = name,
  hiddenLabel,
  label,
  required,
  error,
  valid,
  help,
  fetchImage,
  saveImage,
}: RichTextEditorProps) {
  const renderElement = useCallback((props) => <Element {...props} />, []);
  const renderLeaf = useCallback((props) => <Leaf {...props} />, []);
  const editor = useMemo(
    () => withImages(withHistory(withReact(createEditor()))),
    [],
  );
  const value: Descendant[] =
    initialValue && initialValue.length > 0
      ? initialValue
      : [{ type: 'paragraph', children: [{ text: '' }] }];

  const {
    getRootProps,
    getInputProps,
    open,
    isDragActive,
    isDragReject,
    isDragAccept,
  } = useDropzone({
    accept: 'image/jpeg,image/png',
    noClick: true,
    noKeyboard: true,
    async onDrop(acceptedFiles) {
      if (!saveImage) throw new Error("'saveImage' is not defined");
      for (const file of acceptedFiles) {
        const uuid = await saveImage(file);
        insertImage(editor, uuid);
      }
    },
  });
  const { ref: dropRef, style: _ignored, ...inputProps } = getInputProps();

  return (
    <div className={className} style={style}>
      <div className="flex items-baseline justify-between gap-2">
        <Label id={id} text={label} hidden={hiddenLabel} required={required} />
      </div>
      <div
        className={clsx(
          'rounded-md border px-3 py-2 shadow-sm focus-within:ring-1',
          {
            [inputColor]: !error,
            [inputError]: error,
            [inputValid]: valid,
          },
        )}
      >
        <ImageContext.Provider value={{ fetchImage }}>
          <Slate
            editor={editor}
            value={value}
            onChange={(value) => onChange(value)}
          >
            <div className="grid grid-cols-8 gap-2 py-2 mb-2 border-b-2 border-neutral-300">
              <MarkButton format="bold" icon="formatBold" />
              <MarkButton format="italic" icon="formatItalic" />
              <MarkButton format="underline" icon="formatUnderlined" />
              <BlockButton format="heading-one" icon="looksOne" />
              <BlockButton format="heading-two" icon="looksTwo" />
              <BlockButton format="numbered-list" icon="formatListNumbered" />
              <BlockButton format="bulleted-list" icon="formatListBulleted" />
              <ImageButton onClick={() => open()} />
            </div>
            <div
              {...getRootProps()}
              className={clsx({
                'border-2 border-dashed p-3': isDragActive,
                'border-danger-500 focus:ring-danger-500': isDragReject,
                'border-primary-500 focus:ring-primary-500': isDragAccept,
              })}
              role="document"
            >
              <input {...inputProps} className="sr-only" ref={dropRef} />
              {isDragActive ? (
                isDragReject ? (
                  <p className="text-danger-500">File not accepted</p>
                ) : (
                  <p>Drop the image here ...</p>
                )
              ) : (
                <Editable
                  renderElement={renderElement}
                  renderLeaf={renderLeaf}
                  placeholder="Enter some text…"
                  spellCheck
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
              )}
            </div>
          </Slate>
        </ImageContext.Provider>
      </div>
      <Help error={error} valid={valid} help={help} />
    </div>
  );
}

export function Element({ attributes, children, element }: RenderElementProps) {
  switch (element.type) {
    case 'bulleted-list':
      return (
        <ul className="my-2 list-disc list-inside" {...attributes}>
          {children}
        </ul>
      );
    case 'numbered-list':
      return (
        <ol className="my-2 list-decimal list-inside" {...attributes}>
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
    case 'image':
      return (
        <Image {...element} attributes={attributes}>
          {children}
        </Image>
      );
    default:
      return <p {...attributes}>{children}</p>;
  }
}

export function Leaf({ attributes, children, leaf }: RenderLeafProps) {
  if (leaf.bold) {
    children = <strong>{children}</strong>;
  }

  if (leaf.italic) {
    children = <em>{children}</em>;
  }

  if (leaf.underline) {
    children = <u>{children}</u>;
  }

  return (
    <span className="text-ellipsis" {...attributes}>
      {children}
    </span>
  );
}
