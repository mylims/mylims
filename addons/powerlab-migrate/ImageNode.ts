import {
  DecoratorNode,
  NodeKey,
  EditorConfig,
  SerializedLexicalNode,
  Spread,
  LexicalNode,
  DOMConversionMap,
} from 'lexical';

export interface ImagePayload {
  altText: string;
  caption?: string;
  height?: number;
  key?: NodeKey;
  maxWidth?: number;
  src: string | File;
  width?: number;
}

export type SerializedImageNode = Spread<
  {
    uuid: string;
    altText: string;
    caption?: string;
    height?: number;
    maxWidth: number;
    width?: number;
    type: 'image';
    version: 2;
  },
  SerializedLexicalNode
>;

export class ImageNode extends DecoratorNode<string> {
  public __uuid: string;
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
      node.__uuid,
      node.__altText,
      node.__maxWidth,
      node.__width,
      node.__height,
      node.__caption,
      node.__key,
    );
  }

  public static importJSON(serializedNode: SerializedImageNode): ImageNode {
    const { altText, height, width, maxWidth, caption, uuid } = serializedNode;
    return $createImageNode({
      src: uuid,
      altText,
      height,
      maxWidth,
      width,
      caption,
    });
  }

  public constructor(
    uuid: string,
    altText: string,
    maxWidth: number,
    width?: 'inherit' | number,
    height?: 'inherit' | number,
    caption?: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__uuid = uuid;
    this.__altText = altText;
    this.__maxWidth = maxWidth;
    this.__width = width || 'inherit';
    this.__height = height || 'inherit';
    this.__caption = caption;
  }

  public exportJSON(): SerializedImageNode {
    return {
      uuid: this.getUUID(),
      altText: this.getAltText(),
      caption: this.__caption,
      height: this.__height === 'inherit' ? 0 : this.__height,
      maxWidth: this.__maxWidth,
      type: 'image',
      version: 2,
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

  static importDOM(): DOMConversionMap | null {
    return {
      img: (node: Node) => {
        if (isImage(node)) {
          return {
            conversion(element: Node) {
              if (isImage(element)) {
                const { src, alt: altText } = element;
                return { node: $createImageNode({ src, altText }) };
              } else {
                throw new Error('not an image element');
              }
            },
            priority: 4,
          };
        }
        return null;
      },
    };
  }

  public updateDOM(): false {
    return false;
  }

  public getUUID(): string {
    return this.__uuid;
  }

  public getAltText(): string {
    return this.__altText;
  }

  public decorate() {
    return 'img';
  }
}

function isImage(node: Node): node is HTMLImageElement {
  return node.nodeName.toLowerCase() === 'img';
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
  if (typeof src !== 'string') throw new Error('missing parsed src string');
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
