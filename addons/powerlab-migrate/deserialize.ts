import { createHeadlessEditor } from '@lexical/headless';
import { $generateNodesFromDOM } from '@lexical/html';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { JSDOM } from 'jsdom';
import { $createParagraphNode, $getRoot } from 'lexical';

import { ImageNode } from './ImageNode';

export function toLexical(htmlString: string): Promise<string> {
  return new Promise<string>((resolve, reject) => {
    const editor = createHeadlessEditor({
      namespace: 'lexical',
      nodes: [
        ImageNode,
        ListItemNode,
        ListNode,
        HeadingNode,
        QuoteNode,
        TableCellNode,
        TableNode,
        TableRowNode,
      ],
      onError: (error) => reject(error),
    });

    editor.update(
      () => {
        const dom = new JSDOM(htmlString).window.document;
        const nodes = $generateNodesFromDOM(editor, dom);
        $getRoot().append($createParagraphNode().append(...nodes));
      },
      {
        onUpdate() {
          const editorState = editor.getEditorState();
          resolve(JSON.stringify(editorState));
        },
      },
    );
  });
}

export function replaceImage(content: string, image: string) {
  return content.replace(/"uuid":"(?<uuid>[^"]+)/g, `"uuid":"${image}`);
}
