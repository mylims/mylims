import { parse, HTMLElement, Node } from 'node-html-parser';
import type { Descendant } from 'slate';

import { FormattedText, ListItemElement } from './types';

function isHTML(node: HTMLElement | Node): node is HTMLElement {
  return node.nodeType === 1;
}
function isDescendant(descendant: Descendant | null): descendant is Descendant {
  return descendant !== null;
}

export function toSlate(html: string, imageUuid?: string) {
  const document = parse(html);
  return Array.from(document.childNodes)
    .map((node) => deserialize(node, imageUuid))
    .filter(isDescendant);
}

export function deserialize(
  el: HTMLElement | Node,
  imageUuid?: string,
): Descendant | null {
  if (!isHTML(el)) return { text: el.textContent ?? '' };

  let children = Array.from(el.childNodes)
    .map((node) => deserialize(node, imageUuid))
    .filter(isDescendant);

  if (children.length === 0) children = [{ text: '' }];

  switch (el.rawTagName) {
    case 'br':
    case 'col':
    case 'colgroup':
    case 'font':
    case 'em': {
      return null;
    }
    case 'p':
    case 'span': {
      return { type: 'paragraph', children: children as FormattedText[] };
    }
    case 'strong': {
      return {
        type: 'paragraph',
        children: (children as FormattedText[]).map((child) => ({
          ...child,
          bold: true,
        })),
      };
    }
    case 'h1': {
      return { type: 'heading-one', children: children as FormattedText[] };
    }
    case 'h2': {
      return { type: 'heading-two', children: children as FormattedText[] };
    }
    case 'li': {
      return { type: 'list-item', children: children as FormattedText[] };
    }
    case 'ul': {
      return { type: 'bulleted-list', children: children as ListItemElement[] };
    }
    case 'ol': {
      return { type: 'numbered-list', children: children as ListItemElement[] };
    }
    case 'img': {
      if (!imageUuid) return null;
      return { type: 'image', uuid: imageUuid, children: [{ text: '' }] };
    }
    default: {
      // It's missing the anchor tag, so we'll just return the text.
      // It's missing the table related tags
      return { type: 'paragraph', children: children as FormattedText[] };
    }
  }
}
