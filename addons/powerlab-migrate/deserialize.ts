import { createHeadlessEditor } from '@lexical/headless';
import { $generateNodesFromDOM } from '@lexical/html';
import { ListItemNode, ListNode } from '@lexical/list';
import { HeadingNode, QuoteNode } from '@lexical/rich-text';
import { TableCellNode, TableNode, TableRowNode } from '@lexical/table';
import { JSDOM } from 'jsdom';
import { $createParagraphNode, $getRoot, SerializedElementNode } from 'lexical';

import { ImageNode } from './ImageNode';

interface Node extends SerializedElementNode {
  uuid?: string;
  children: Node[];
}

export function toLexical(
  htmlString: string,
  slimsImage: string | null | undefined,
): Promise<string> {
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
          const root = editor.getEditorState().toJSON().root as Node;
          resolve(JSON.stringify({ root: checkStateTree(root, slimsImage) }));
        },
      },
    );
  });
}

function checkStateTree(
  node: Node,
  slimsImage: string | null | undefined,
): Node {
  // Adds the uuid to the node image
  if (node.type === 'image') {
    // console.log(node.uuid, slimsImage);
    return {
      ...node,
      uuid: typeof slimsImage === 'string' ? slimsImage : node.uuid,
    };
  }

  // Base case
  if (!node.children) return node;

  // Adds the value to list (missing feature on default parser)
  if (node.type === 'list') {
    const children = node.children.map((child, index) => ({
      ...checkStateTree(child, slimsImage),
      value: index + 1,
    }));
    return { ...node, children };
  }

  // Regular case with children
  const children = node.children.map((child) =>
    checkStateTree(child, slimsImage),
  );
  return { ...node, children };
}
