import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { useLexicalNodeSelection } from '@lexical/react/useLexicalNodeSelection';
import { mergeRegister } from '@lexical/utils';
import type {
  EditorConfig,
  GridSelection,
  LexicalNode,
  NodeKey,
  NodeSelection,
  RangeSelection,
  SerializedLexicalNode,
  Spread,
} from 'lexical';
import {
  $getNodeByKey,
  $getSelection,
  $isNodeSelection,
  CLICK_COMMAND,
  COMMAND_PRIORITY_LOW,
  DecoratorNode,
  KEY_BACKSPACE_COMMAND,
  KEY_DELETE_COMMAND,
} from 'lexical';
import React, {
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';

import ImageResizer from '../components/ImageResizer';

export interface ImagePayload {
  altText: string;
  caption?: string;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  src: string;
  width?: number;
}

const imageCache = new Set();

function useSuspenseImage(src: string) {
  if (!imageCache.has(src)) {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imageCache.add(src);
        resolve(null);
      };
    });
  }
}

function LazyImage({
  altText,
  className,
  imageRef,
  src,
  width,
  height,
  maxWidth,
}: {
  altText: string;
  className: string | null;
  height: 'inherit' | number;
  imageRef: { current: null | HTMLImageElement };
  maxWidth: number;
  src: string;
  width: 'inherit' | number;
}): JSX.Element {
  useSuspenseImage(src)?.catch((error) => {
    throw new Error(error);
  });
  return (
    <img
      className={className ?? undefined}
      src={src}
      alt={altText}
      ref={imageRef}
      style={{ height, maxWidth, width }}
      draggable="false"
    />
  );
}

function ImageComponent({
  src,
  altText,
  nodeKey,
  width,
  height,
  maxWidth,
  resizable,
  caption,
}: {
  altText: string;
  height: 'inherit' | number;
  maxWidth: number;
  nodeKey: NodeKey;
  resizable: boolean;
  src: string;
  width: 'inherit' | number;
  caption?: string;
}): JSX.Element {
  const ref = useRef(null);
  const [isSelected, setSelected, clearSelection] =
    useLexicalNodeSelection(nodeKey);
  const [isResizing, setIsResizing] = useState<boolean>(false);
  const [editor] = useLexicalComposerContext();
  const [selection, setSelection] = useState<
    RangeSelection | NodeSelection | GridSelection | null
  >(null);

  const onDelete = useCallback(
    (payload: KeyboardEvent) => {
      if (isSelected && $isNodeSelection($getSelection())) {
        const event: KeyboardEvent = payload;
        event.preventDefault();
        const node = $getNodeByKey(nodeKey);
        if ($isImageNode(node)) node.remove();
        setSelected(false);
      }
      return false;
    },
    [isSelected, nodeKey, setSelected],
  );

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        setSelection(editorState.read(() => $getSelection()));
      }),
      editor.registerCommand<MouseEvent>(
        CLICK_COMMAND,
        (event) => {
          if (isResizing) return true;

          if (event.target === ref.current) {
            if (!event.shiftKey) clearSelection();
            setSelected(!isSelected);
            return true;
          }

          return false;
        },
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_DELETE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
      editor.registerCommand(
        KEY_BACKSPACE_COMMAND,
        onDelete,
        COMMAND_PRIORITY_LOW,
      ),
    );
  }, [
    editor,
    isResizing,
    isSelected,
    nodeKey,
    onDelete,
    setSelected,
    clearSelection,
  ]);

  const setCaption = (caption: string) => {
    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) node.setCaption(caption);
    });
  };

  const onResizeEnd = (
    nextWidth: number | 'inherit',
    nextHeight: number | 'inherit',
  ) => {
    // Delay hiding the resize bars for click case
    setTimeout(() => setIsResizing(false), 200);

    editor.update(() => {
      const node = $getNodeByKey(nodeKey);
      if ($isImageNode(node)) node.setWidthAndHeight(nextWidth, nextHeight);
    });
  };

  const onResizeStart = () => setIsResizing(true);
  const draggable = isSelected && $isNodeSelection(selection);
  const isFocused = $isNodeSelection(selection) && (isSelected || isResizing);

  return (
    <Suspense fallback={null}>
      <>
        <div
          draggable={draggable}
          className={
            isFocused
              ? 'mx-0.5 select-none outline outline-2 outline-primary-500'
              : undefined
          }
        >
          <LazyImage
            className="max-w-full"
            imageRef={ref}
            src={src}
            altText={altText}
            width={width}
            height={height}
            maxWidth={maxWidth}
          />
          {caption ? (
            <div className="border-t-white bg-neutral-100">
              <label htmlFor="img-caption" className="hidden">
                Image caption
              </label>
              <input
                value={caption}
                onChange={(event) => setCaption(event.target.value)}
                id="img-caption"
                className="bottom-0 left-0 right-0 m-0 block w-full min-w-[100px] overflow-hidden border-none bg-neutral-100 p-2 text-black focus:outline-none focus:ring-0"
              />
            </div>
          ) : null}
        </div>
        {resizable && isFocused && (
          <ImageResizer
            showCaption={!!caption}
            setShowCaption={() => setCaption(' ')}
            editor={editor}
            imageRef={ref}
            maxWidth={maxWidth}
            onResizeStart={onResizeStart}
            onResizeEnd={onResizeEnd}
          />
        )}
      </>
    </Suspense>
  );
}

export type SerializedImageNode = Spread<
  {
    altText: string;
    caption?: string;
    height?: number;
    maxWidth: number;
    src: string;
    width?: number;
    type: 'image';
    version: 1;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<JSX.Element> {
  public __src: string;
  public __altText: string;
  public __width: 'inherit' | number;
  public __height: 'inherit' | number;
  public __maxWidth: number;
  public __caption?: string;

  public static getType(): string {
    return 'image';
  }

  public static clone(node: ImageNode): ImageNode {
    return new ImageNode(
      node.__src,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__caption,
      node.__key,
    );
  }

  public static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, caption, src } = serializedNode;
    return $createImageNode({
      altText,
      height,
      maxWidth,
      src,
      width,
      caption,
    });
  }

  public constructor(
    src: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    caption?: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__src = src;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__caption = caption;
  }

  public exportJSON(): SerializedImageNode {
    return {
      altText: this.getAltText(),
      caption: this.__caption,
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      src: this.getSrc(),
      type: 'image',
      version: 1,
      width: this.__width === 'inherit' ? 0 : this.__width,
    };
  }

  public setWidthAndHeight(
    width: 'inherit' | number,
    height: 'inherit' | number,
  ): void {
    const writable = this.getWritable();
    writable.__width = width;
    writable.__height = height;
  }

  public setCaption(caption: string) {
    const writable = this.getWritable();
    writable.__caption = caption;
  }

  public createDOM(config: EditorConfig): HTMLElement {
    const span = document.createElement('span');
    const theme = config.theme;
    const className = theme.image;
    if (className !== undefined) {
      span.className = className;
    }
    return span;
  }

  public updateDOM(): false {
    return false;
  }

  public getSrc(): string {
    return this.__src;
  }

  public getAltText(): string {
    return this.__altText;
  }

  public decorate(): JSX.Element {
    return (
      <ImageComponent
        src={this.__src}
        altText={this.__altText}
        width={this.__width}
        height={this.__height}
        maxWidth={this.__maxWidth}
        nodeKey={this.getKey()}
        caption={this.__caption}
        resizable
      />
    );
  }
}

export function $createImageNode({
  altText,
  height,
  maxWidth = 500,
  src,
  width,
  caption,
  key,
}: ImagePayload): ImageNode {
  return new ImageNode(
    src,
    altText,
    maxWidth,
    width,
    height,
    caption ?? altText,
    key,
  );
}

export function $isImageNode(
  node: LexicalNode | null | undefined,
): node is ImageNode {
  return node instanceof ImageNode;
}
