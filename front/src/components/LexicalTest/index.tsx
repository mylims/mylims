import { CodeHighlightNode, CodeNode } from '@lexical/code';
import { AutoLinkNode, LinkNode } from '@lexical/link';
import { ListItemNode, ListNode } from '@lexical/list';
import AutoFocusPlugin from '@lexical/react/LexicalAutoFocusPlugin';
import LexicalComposer from '@lexical/react/LexicalComposer';
import ContentEditable from '@lexical/react/LexicalContentEditable';
import { HistoryPlugin } from '@lexical/react/LexicalHistoryPlugin';
import LinkPlugin from '@lexical/react/LexicalLinkPlugin';
import ListPlugin from '@lexical/react/LexicalListPlugin';
import LexicalMarkdownShortcutPlugin from '@lexical/react/LexicalMarkdownShortcutPlugin';
import LexicalOnChangePlugin from '@lexical/react/LexicalOnChangePlugin';
import RichTextPlugin from '@lexical/react/LexicalRichTextPlugin';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import React from 'react';

import { SampleLinkNode } from './models/SampleLink';
import AutoLinkPlugin from './plugins/AutoLinkPlugin';
import ListMaxIndentLevelPlugin from './plugins/ListMaxIndentLevelPlugin';
import SampleLinkPlugin from './plugins/SampleLinkPlugin';
import ToolbarPlugin from './plugins/ToolbarPlugin';
import ExampleTheme from './themes/ExampleTheme';

function Placeholder() {
  return (
    <div className="pointer-events-none absolute top-4 left-4 inline-block select-none overflow-hidden text-ellipsis text-neutral-400">
      Enter some rich text...
    </div>
  );
}

const editorConfig = {
  // The editor theme
  theme: ExampleTheme,
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
    CodeNode,
    CodeHighlightNode,
    TableNode,
    TableCellNode,
    TableRowNode,
    AutoLinkNode,
    LinkNode,
    SampleLinkNode,
  ],
};

export default function Editor() {
  return (
    <LexicalComposer initialConfig={editorConfig}>
      <div className="relative m-2 rounded-t-md rounded-b-sm font-normal leading-5 text-black">
        <ToolbarPlugin />
        <div className="relative bg-white">
          <RichTextPlugin
            contentEditable={
              <ContentEditable className="relative min-h-[150px] resize-none pt-4 pl-4 caret-neutral-500 outline-none" />
            }
            placeholder={<Placeholder />}
          />
          <HistoryPlugin />
          <AutoFocusPlugin />
          <ListPlugin />
          <LinkPlugin />
          <AutoLinkPlugin />
          <ListMaxIndentLevelPlugin maxDepth={7} />
          <LexicalMarkdownShortcutPlugin />
          {/* <LexicalOnChangePlugin
            onChange={(editorState) => console.log(editorState)}
          /> */}

          {/* Custom plugins */}
          <SampleLinkPlugin />
        </div>
      </div>
    </LexicalComposer>
  );
}
