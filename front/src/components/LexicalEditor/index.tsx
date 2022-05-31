import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import AutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalComposer from '@lexical/react/LexicalComposer';
import ContentEditable from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LinkPlugin from '@lexical/react/LexicalLinkPlugin';
import ListPlugin from '@lexical/react/LexicalListPlugin';
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
// import OnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import React from 'react';

import { SampleLinkNode } from './models/SampleLinkNode';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import SampleLinkPlugin from './plugins/SampleLinkPlugin';
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
    SampleLinkNode,
  ],
};

// TODO: This only will work on the new release of Lexical
// export interface LexicalEditorProps {
//   value: JSONEditorState;
//   onChange(value: JSONEditorState): void;
// }
// export default function LexicalEditor({ value, onChange }: LexicalEditorProps) {
export default function LexicalEditor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative m-2 rounded-t-md rounded-b-sm font-normal leading-5 text-black">
        <ToolbarPlugin />
        <div className="relative bg-white">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="relative min-h-[150px] resize-none pt-4 caret-neutral-500 outline-none" />
            }
            placeholder={<Placeholder />}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          {/* <OnChangePlugin
            onChange={(editorState) => {
              return onChange(editorState.toJSON());
            }}
          /> */}

          {/* Custom plugins */}
          <SampleLinkPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}