import {
  $getNodeByKey,
  DecoratorNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
} from 'lexical';
import React, { ReactNode } from 'react';

import { SampleLink } from '../components/SampleLink';

type SampleLinkStatus =
  | { status: 'idle' }
  | { status: 'waiting' }
  | { status: 'success'; type: string; id: string }
  | { status: 'error'; error: string };
const SAMPLE_LEVELS = ['wafer', 'sample', 'dye', 'device'];

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
        setSampleCode={(sampleCode) =>
          editor.update(() => this.setSampleCode(sampleCode))
        }
      />
    );
  }

  public setSampleCode(sampleCode: string) {
    const self = this.getWritable<SampleLinkNode>();
    self.__sampleCode = sampleCode;
  }

  public async queryStatus() {
    const self = this.getWritable<SampleLinkNode>();
    const sampleCode = this.__sampleCode.split('_');
    const level = SAMPLE_LEVELS[sampleCode.length - 1];
    if (level === undefined) {
      self.__queryStatus = { status: 'error', error: 'invalid sample code' };
    } else {
      self.__queryStatus = { status: 'waiting' };
      try {
        const { id, type } = await this._getSampleByCode(sampleCode);
        self.__queryStatus = { status: 'success', type, id };
      } catch (error) {
        self.__queryStatus = { status: 'error', error: 'not found' };
      }
    }
  }

  private async _getSampleByCode(
    sampleCode: string[],
  ): Promise<{ id: string; type: string }> {
    throw new Error('Method not implemented.');
  }
}

export function $createSampleLinkNode(text: string): SampleLinkNode {
  return new SampleLinkNode(text, { status: 'idle' });
}

export function $isSampleLinkNode(node?: LexicalNode): boolean {
  return node instanceof SampleLinkNode;
}
