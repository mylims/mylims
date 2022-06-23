import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import { AutoFocusPlugin } from '@lexical/react/LexicalAutoFocusPlugin';
import { LexicalComposer } from '@lexical/react/LexicalComposer';
import { ContentEditable } from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { OnChangePlugin } from '@lexical/react/LexicalOnChangePlugin';
import { RichTextPlugin } from '@lexical/react/LexicalRichTextPlugin';
import { TablePlugin } from '@lexical/react/LexicalTablePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import React from 'react';

import { sampleLinkContext } from './hooks/useSampleLinkContext';
import { EquationNode } from './nodes/EquationNode';
import { ImageNode } from './nodes/ImageNode';
import { SampleLinkNode } from './nodes/SampleLinkNode';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import EquationsPlugin from './plugins/EquationsPlugin';
import ImagesPlugin from './plugins/ImagesPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import SampleLinkPlugin from './plugins/SampleLinkPlugin';
import TableCellActionMenuPlugin from './plugins/TableActionMenuPlugin';
import TableCellResizer from './plugins/TableCellResizer';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import TailwindTheme from './themes/TailwindTheme';

function Placeholder() {
  return (
    <div className="pointer-events-none absolute top-4 inline-block select-none overflow-hidden text-ellipsis text-neutral-400">
      Enter some rich text...
    </div>
  );
}

const editorConfig = {
  namespace: 'lexical',
  // The editor theme
  theme: TailwindTheme,
  // Handling of errors during update
  onError(error: Error) {
    throw error;
  },
  // Any custom nodes go here
  nodes: [
    HeadingNode,
    ListNode,
    ListItemNode,
    QuoteNode,
    AutoLinkNode,
    LinkNode,
    EquationNode,
    ImageNode,
    SampleLinkNode,
    TableNode,
    TableCellNode,
    TableRowNode,
  ],
};

export interface LexicalEditorProps {
  value: string;
  onChange(value: string): void;
  samples: string[];
  onSamplesChange(samples: string[]): void;
}
export default function LexicalEditor({
  value,
  onChange,
  samples,
  onSamplesChange,
}: LexicalEditorProps) {
  const SampleLinkContext = sampleLinkContext;
  function addSample(id: string) {
    if (!samples.includes(id)) onSamplesChange([...samples, id]);
  }
  return (
    <SampleLinkContext.Provider value={{ samples, addSample }}>
      <LexicalComposer initialConfig={editorConfig}>
        <div className="relative m-2 rounded-b-sm rounded-t-md font-normal leading-5 text-black">
          <ToolbarPlugin />
          <div className="relative bg-white">
            <RichTextPlugin
              contentEditable={
                <ContentEditable
                  ariaLabel="Rich text editor"
                  className="relative min-h-[150px] resize-none pt-4 caret-neutral-500 outline-none"
                />
              }
              placeholder={<Placeholder />}
              initialEditorState={value}
            />
            <HistoryPlugin />
            <AutoFocusPlugin />
            <ListPlugin />
            <LinkPlugin />
            <AutoLinkPlugin />
            <ListMaxIndentLevelPlugin maxDepth={7} />
            <OnChangePlugin
              ignoreInitialChange
              ignoreSelectionChange
              onChange={(editorState) => {
                const content = JSON.stringify(editorState);
                if (content !== value) onChange(content);
              }}
            />
            <EquationsPlugin />
            <ImagesPlugin />
            <TablePlugin />
            <TableCellActionMenuPlugin />
            <TableCellResizer />

            {/* Custom plugins */}
            <SampleLinkPlugin />
          </div>
        </div>
      </LexicalComposer>
    </SampleLinkContext.Provider>
  );
}
