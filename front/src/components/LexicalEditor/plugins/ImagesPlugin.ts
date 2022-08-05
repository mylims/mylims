import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { mergeRegister } from '@lexical/utils';
import type { LexicalCommand, LexicalEditor } from 'lexical';
import {
  $createRangeSelection,
  $getSelection,
  $isNodeSelection,
  $isRangeSelection,
  $isRootNode,
  $setSelection,
  COMMAND_PRIORITY_EDITOR,
  COMMAND_PRIORITY_HIGH,
  COMMAND_PRIORITY_LOW,
  createCommand,
  DRAGOVER_COMMAND,
  DRAGSTART_COMMAND,
  DROP_COMMAND,
} from 'lexical';
import { useEffect } from 'react';

import { IMAGE_URL } from '@/../env';

import {
  $createImageNode,
  $isImageNode,
  ImageNode,
  ImagePayload,
} from '../nodes/ImageNode';

function getSelection() {
  return window.getSelection();
}

export type InsertImagePayload = Readonly<ImagePayload>;

export const INSERT_IMAGE_COMMAND: LexicalCommand<InsertImagePayload> =
  createCommand();
interface ImagesPluginProps {
  saveImage: (file: File) => Promise<string>;
}
export default function ImagesPlugin({
  saveImage,
}: ImagesPluginProps): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([ImageNode])) {
      throw new Error('ImagesPlugin: ImageNode not registered on editor');
    }
    if (!IMAGE_URL) {
      throw new Error('ImagesPlugin: Image URL is required');
    }

    return mergeRegister(
      editor.registerCommand<InsertImagePayload>(
        INSERT_IMAGE_COMMAND,
        (payload) => {
          const selection = $getSelection();
          if ($isRangeSelection(selection)) {
            if ($isRootNode(selection.anchor.getNode())) {
              selection.insertParagraph();
            }
            let { src, ...rest } = payload;
            if (typeof src !== 'string') {
              saveImage(src)
                .then((uuid) => {
                  editor.update(() => {
                    const imageNode = $createImageNode({ src: uuid, ...rest });
                    selection.insertNodes([imageNode]);
                  });
                })
                // eslint-disable-next-line no-console
                .catch(console.error);
            } else {
              const imageNode = $createImageNode({ src, ...rest });
              selection.insertNodes([imageNode]);
            }
          }
          return true;
        },
        COMMAND_PRIORITY_EDITOR,
      ),
      editor.registerCommand<DragEvent>(
        DRAGSTART_COMMAND,
        (event) => onDragStart(event),
        COMMAND_PRIORITY_HIGH,
      ),
      editor.registerCommand<DragEvent>(
        DRAGOVER_COMMAND,
        (event) => onDragover(event),
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand<DragEvent>(
        DROP_COMMAND,
        (event) => onDrop(event, editor),
        COMMAND_PRIORITY_HIGH,
      ),
    );
  }, [editor, saveImage]);

  return null;
}

const TRANSPARENT_IMAGE =
  'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7';
const img = document.createElement('img');
img.src = TRANSPARENT_IMAGE;

function onDragStart(event: DragEvent): boolean {
  const node = getImageNodeInSelection();
  if (!node) return false;

  const dataTransfer = event.dataTransfer;
  if (!dataTransfer) return false;

  dataTransfer.setData('text/plain', '_');
  dataTransfer.setDragImage(img, 0, 0);
  dataTransfer.setData(
    'application/x-lexical-drag',
    JSON.stringify({
      data: {
        altText: node.__altText,
        caption: node.__caption,
        height: node.__height,
        key: node.getKey(),
        maxWidth: node.__maxWidth,
        showCaption: node.__showCaption,
        src: node.__src,
        width: node.__width,
      },
      type: 'image',
    }),
  );

  return true;
}

function onDragover(event: DragEvent): boolean {
  const node = getImageNodeInSelection();
  if (!node) return false;

  if (!canDropImage(event)) event.preventDefault();

  return true;
}

function onDrop(event: DragEvent, editor: LexicalEditor): boolean {
  const node = getImageNodeInSelection();
  if (!node) return false;

  const data = getDragImageData(event);
  if (!data) return false;

  event.preventDefault();
  if (canDropImage(event)) {
    const range = getDragSelection(event);
    node.remove();
    const domSelection = getSelection();
    domSelection?.removeAllRanges();
    domSelection?.addRange(range);
    const rangeSelection = $createRangeSelection();
    rangeSelection.applyDOMRange(range);
    $setSelection(rangeSelection);
    editor.dispatchCommand(INSERT_IMAGE_COMMAND, data);
  }
  return true;
}

function getImageNodeInSelection(): ImageNode | null {
  const selection = $getSelection();
  if (!$isNodeSelection(selection)) return null;

  const nodes = selection.getNodes();
  const node = nodes[0];
  return $isImageNode(node) ? node : null;
}

function getDragImageData(event: DragEvent): null | InsertImagePayload {
  const dragData = event.dataTransfer?.getData('application/x-lexical-drag');
  if (!dragData) return null;

  const { type, data } = JSON.parse(dragData);
  if (type !== 'image') return null;

  return data;
}

declare global {
  interface DragEvent {
    rangeOffset?: number;
    rangeParent?: Node;
  }
}

function canDropImage(event: DragEvent): boolean {
  const target = event.target;
  return !!(
    target &&
    target instanceof HTMLElement &&
    !target.closest('code, span.editor-image') &&
    target.parentElement &&
    target.parentElement.closest('div.ContentEditable__root')
  );
}

function getDragSelection(event: DragEvent): Range {
  let range;
  const domSelection = getSelection();
  if (document.caretRangeFromPoint) {
    range = document.caretRangeFromPoint(event.clientX, event.clientY);
  } else if (event.rangeParent) {
    domSelection?.collapse(event.rangeParent, event.rangeOffset || 0);
    range = domSelection?.getRangeAt(0);
  } else {
    throw Error(`Cannot get the selection when dragging`);
  }

  if (!range) {
    throw Error(`Cannot get the selection when dragging`);
  }

  return range;
}
