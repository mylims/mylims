import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $getRoot,
  LexicalCommand,
  COMMAND_PRIORITY_EDITOR,
  createCommand,
} from 'lexical';
import { useEffect } from 'react';
import 'katex/dist/katex.css';

import { $createEquationNode, EquationNode } from '../nodes/EquationNode';

interface CommandPayload {
  equation: string;
  inline: boolean;
}

export const INSERT_EQUATION_COMMAND: LexicalCommand<CommandPayload> =
  createCommand();

export default function EquationsPlugin(): JSX.Element | null {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([EquationNode])) {
      throw new Error(
        'EquationsPlugins: EquationsNode not registered on editor',
      );
    }

    return editor.registerCommand<CommandPayload>(
      INSERT_EQUATION_COMMAND,
      (payload) => {
        const { equation, inline } = payload;
        const root = $getRoot();
        root.append($createEquationNode(equation, inline));

        return true;
      },
      COMMAND_PRIORITY_EDITOR,
    );
  }, [editor]);

  return null;
}
