import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createCommand, LexicalCommand } from 'lexical';
import { useEffect } from 'react';

import { PlotNode } from '../nodes/PlotNode';

export type InsertPlotPayload = Readonly<{
  id: string;
  type: string;
  sampleCode: string;
}>;
export const INSERT_SAMPLE_LINK_COMMAND: LexicalCommand<InsertPlotPayload> =
  createCommand();

export interface PlotRef {
  appendPlot(sampleCode: string): void;
}
export default function PlotPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([PlotNode])) {
      throw new Error('PlotNode: PlotNode not registered on editor');
    }
  }, [editor]);

  return null;
}
