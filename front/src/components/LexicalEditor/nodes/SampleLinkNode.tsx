import {
  DecoratorNode,
  DOMConversionMap,
  DOMConversionOutput,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedElementNode,
} from 'lexical';
import React, { ReactNode } from 'react';

import {
  SampleStatus,
  SampleLink,
  SampleLinkStatus,
} from '../components/SampleLink';

interface SerializedSampleLinkNode extends SerializedElementNode {
  sampleCode: string;
  type: 'sampleLink';
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
      ...super.exportJSON(),
      sampleCode: this.__sampleCode,
      type: 'sampleLink',
      version: 1,
    };
  }

  public static importDOM(): DOMConversionMap | null {
    return {
      span() {
        return {
          conversion(domNode: Node): DOMConversionOutput {
            const span = domNode as HTMLSpanElement;
            return {
              node: isSampleLink(span) ? $createSampleLinkNode('') : null,
            };
          },
          priority: 1,
        };
      },
    };
  }
}

function isSampleLink(span: HTMLSpanElement): boolean {
  return /SampleLink/.exec(span.className) !== null;
}

export function $createSampleLinkNode(text: string): SampleLinkNode {
  return new SampleLinkNode(text, { status: SampleStatus.waiting });
}

export function $isSampleLinkNode(node?: LexicalNode): boolean {
  return node instanceof SampleLinkNode;
}
