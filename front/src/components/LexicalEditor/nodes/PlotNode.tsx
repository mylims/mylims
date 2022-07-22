import {PlotFromURL} from '@/components/PlotJcamp/PlotFromURL';
import {
  DecoratorNode,
  LexicalEditor,
  LexicalNode,
  NodeKey,
  SerializedLexicalNode,
} from 'lexical';
import React, { ReactNode } from 'react';

interface SerializedPlotNode extends SerializedLexicalNode {
  fileId: string;
  fileUrl: string;
  type: 'Plot';
  version: 1;
}
export class PlotNode extends DecoratorNode<ReactNode> {
  public __fileId: string;
  private __fileUrl: string;

  public static getType(): string {
    return 'Plot';
  }

  public static clone(node: PlotNode): PlotNode {
    return new PlotNode(
      node.__fileId,
      node.__fileUrl,
      node.__key,
    );
  }

  public constructor(
    fileId: string,
    fileUrl: string,
    key?: NodeKey,
  ) {
    super(key);
    this.__fileId = fileId;
    this.__fileUrl = fileUrl
  }

  public createDOM(): HTMLElement {
    return document.createElement('span');
  }

  public updateDOM(): false {
    return false;
  }

  public decorate(): ReactNode {
    return (
      <PlotFromURL
        fileId={this.__fileId}
        fileUrl={this.__fileUrl}
      />
    );
  }

  public static importJSON(
    serializedNode: SerializedPlotNode,
  ): PlotNode {
    return $createPlotNode(serializedNode.fileId, serializedNode.fileUrl);
  }

  public exportJSON(): SerializedPlotNode {
    return {
      fileId: this.__fileId,
      fileUrl: this.__fileUrl,
      type: 'Plot',
      version: 1,
    };
  }
}

export function $createPlotNode(fileId: string, fileUrl: string): PlotNode {
  return new PlotNode(fileId, fileUrl);
}

export function $isPlotNode(node?: LexicalNode): boolean {
  return node instanceof PlotNode;
}
