import {
  DecoratorNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from 'lexical';
import React, { ReactNode } from 'react';

import {
  SampleStatus,
  SampleLink,
  SampleLinkStatus,
} from '../components/SampleLink';

interface SerializedSampleLinkNode extends SerializedLexicalNode {
  sampleCode: string;
  type: 'SampleLink';
  version: 1;
}
export class SampleLinkNode extends DecoratorNode<ReactNode> {
  public __sampleCode: string;
  private __queryStatus: SampleLinkStatus;

  public static getType(): string {
    return 'SampleLink';
  }

  public static clone(node: SampleLinkNode): SampleLinkNode {
    return new SampleLinkNode(
      node.__sampleCode,
      node.__queryStatus,
      node.__key,
    );
  }

  public constructor(
    sampleCode: string,
    queryStatus: SampleLinkStatus,
    key?: NodeKey,
  ) {
    super(key);
    this.__sampleCode = sampleCode;
    this.__queryStatus = queryStatus;
  }

  public createDOM(): HTMLElement {
    return document.createElement('span');
  }

  public updateDOM(): false {
    return false;
  }

  public decorate(editor: LexicalEditor): ReactNode {
    return (
      <SampleLink
        keyNode={this.__key}
        sampleCode={this.__sampleCode}
        setSampleCode={(sampleCode) => {
          editor.update(() => this.setSampleCode(sampleCode));
        }}
        queryStatus={this.__queryStatus}
        setQueryStatus={(queryStatus) => {
          editor.update(() => this.setQueryStatus(queryStatus));
        }}
        setFocusOff={() => {
          editor.update(() => this.selectNext());
        }}
      />
    );
  }

  public setSampleCode(sampleCode: string) {
    const self = this.getWritable();
    self.__sampleCode = sampleCode;
  }

  public getSampleCode(): string {
    return this.__sampleCode;
  }

  public setQueryStatus(queryStatus: SampleLinkStatus) {
    const self = this.getWritable();
    self.__queryStatus = queryStatus;
  }

  public static importJSON(
    serializedNode: SerializedSampleLinkNode,
  ): SampleLinkNode {
    return $createSampleLinkNode(serializedNode.sampleCode);
  }

  public exportJSON(): SerializedSampleLinkNode {
    return {
      sampleCode: this.getSampleCode(),
      type: 'SampleLink',
      version: 1,
    };
  }
}

export function $createSampleLinkNode(text: string): SampleLinkNode {
  return new SampleLinkNode(text, { status: SampleStatus.waiting });
}

export function $isSampleLinkNode(node?: LexicalNode): boolean {
  return node instanceof SampleLinkNode;
}
