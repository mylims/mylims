import { parse, HTMLElement, Node } from 'node-html-parser';
import type { Descendant } from 'slate';

import { FormattedText, CustomElement, ListItemElement } from './types';

function isHTML(node: HTMLElement | Node): node is HTMLElement {
  return node.nodeType === 1;
}
function isElement(node: Descendant): node is CustomElement {
  return (node as CustomElement).type !== undefined;
}
function isListItemElement(node: Descendant): node is ListItemElement {
  return (node as ListItemElement).type === 'list-item';
}

/**
 * Filter the possible children of a node to only allows text nodes.
 * @param children - List of possible nodes or edges
 * @returns Flat list of nodes only
 */
function flatFormattedText(children: Descendant[]) {
  let textChildren: FormattedText[] = [];
  let elementChildren: CustomElement[] = [];
  for (const child of children) {
    if (isElement(child)) {
      if (['paragraph', 'heading-one', 'heading-two'].includes(child.type)) {
        const {
          textChildren: childTextChildren,
          elementChildren: childElementChildren,
        } = flatFormattedText(child.children);
        elementChildren.concat(childElementChildren);
        textChildren = textChildren.concat(childTextChildren);
      } else if (child.children.length > 0) {
        elementChildren.push(child);
      }
    } else {
      textChildren.push(child);
    }
  }
  if (textChildren.length === 0) {
    textChildren.push({ text: '' });
  }
  return { textChildren, elementChildren };
}

function deserializeChildren(nodes: Node[], imageUuid?: string): Descendant[] {
  let result: Descendant[] = [];
  for (const node of nodes) {
    const parsed = deserialize(node, imageUuid);
    if (parsed !== null) {
      result = result.concat(parsed);
    }
  }
  return result;
}

export function toSlate(html: string, imageUuid?: string) {
  const document = parse(html);
  const result = deserializeChildren(document.childNodes, imageUuid);
  if (result.length === 0) return [{ text: '' }];
  return result;
}

export function deserialize(
  el: HTMLElement | Node,
  imageUuid?: string,
): Descendant[] | null {
  if (!isHTML(el)) {
    const text = el.textContent?.replace(/(?<space>\r\n|\n|\r)/gm, '');
    if (text === '') return null;
    return [{ text }];
  }

  let children = deserializeChildren(el.childNodes, imageUuid);
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
      const { textChildren, elementChildren } = flatFormattedText(children);
      return [
        { type: 'paragraph', children: textChildren },
        ...elementChildren,
      ];
    }
    case 'strong': {
      const { textChildren, elementChildren } = flatFormattedText(children);
      return [
        {
          type: 'paragraph',
          children: textChildren.map((child) => ({ ...child, bold: true })),
        },
        ...elementChildren,
      ];
    }
    case 'h1': {
      const { textChildren, elementChildren } = flatFormattedText(children);
      return [
        { type: 'heading-one', children: textChildren },
        ...elementChildren,
      ];
    }
    case 'h2': {
      const { textChildren, elementChildren } = flatFormattedText(children);
      return [
        { type: 'heading-two', children: textChildren },
        ...elementChildren,
      ];
    }
    case 'li': {
      const { textChildren, elementChildren } = flatFormattedText(children);
      return [
        { type: 'list-item', children: textChildren },
        ...elementChildren,
      ];
    }
    case 'ul': {
      const listItems = children.filter(isListItemElement);
      return [{ type: 'bulleted-list', children: listItems }];
    }
    case 'ol': {
      const listItems = children.filter(isListItemElement);
      return [{ type: 'numbered-list', children: listItems }];
    }
    case 'img': {
      if (!imageUuid) return null;
      return [{ type: 'image', uuid: imageUuid, children: [{ text: '' }] }];
    }
    default: {
      // It's missing the anchor tag, so we'll just return the text.
      // It's missing the table related tags
      const { textChildren, elementChildren } = flatFormattedText(children);
      return [
        { type: 'paragraph', children: textChildren },
        ...elementChildren,
      ];
    }
  }
}
