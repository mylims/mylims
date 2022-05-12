import { addClassNamesToElement } from '@lexical/utils';
import { EditorConfig, LexicalNode, NodeKey, TextNode } from 'lexical';
import React from 'react';

export class SampleLinkNode extends TextNode {
  public __sampleId: string;
  public __sampleType: string;

  public static getType(): string {
    return 'SampleLink';
  }

  public static clone(node: SampleLinkNode): SampleLinkNode {
    return new SampleLinkNode(
      node.__sampleId,
      node.__sampleType,
      node.__text,
      node.__key,
    );
  }

  public constructor(
    sampleId: string,
    sampleType: string,
    text: string,
    key?: NodeKey,
  ) {
    super(text, key);
    this.__sampleId = sampleId;
    this.__sampleType = sampleType;
  }

  public createDOM(config: EditorConfig) {
    const element = super.createDOM(config);
    addClassNamesToElement(element, 'bg-primary-200');
    return element;
  }

  public canInsertTextBefore(): boolean {
    return false;
  }

  public isTextEntity(): true {
    return true;
  }
}

export function $createSampleLinkNode(
  sampleId: string,
  sampleType: string,
  text: string,
): SampleLinkNode {
  return new SampleLinkNode(sampleId, sampleType, text);
}

export function $isSampleLinkNode(node?: LexicalNode): boolean {
  return node instanceof SampleLinkNode;
}
