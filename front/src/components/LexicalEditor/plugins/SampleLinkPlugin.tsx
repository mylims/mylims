import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { createCommand, LexicalCommand, TextNode } from 'lexical';
import { useCallback, useEffect } from 'react';

import { $createSampleLinkNode, SampleLinkNode } from '../nodes/SampleLinkNode';
import { SAMPLE_REGEX } from '../utils/regex';

export type InsertSampleLinkPayload = Readonly<{
  id: string;
  type: string;
  sampleCode: string;
}>;
export const INSERT_SAMPLE_LINK_COMMAND: LexicalCommand<InsertSampleLinkPayload> =
  createCommand();

export interface SampleLinkRef {
  appendSampleLink(sampleCode: string): void;
}
export default function SampleLinkPlugin() {
  const [editor] = useLexicalComposerContext();

  useEffect(() => {
    if (!editor.hasNodes([SampleLinkNode])) {
      throw new Error(
        'SampleLinkNode: SampleLinkNode not registered on editor',
      );
    }
  }, [editor]);

  const getHashtagMatch = useCallback((text: string) => {
    const matchArr = SAMPLE_REGEX.exec(text);
    if (matchArr === null) {
      return null;
    }
    const hashtagLen = matchArr.groups?.sampleCode.length ?? 1;
    return {
      end: hashtagLen + matchArr.index,
      start: matchArr.index,
    };
  }, []);

  useEffect(() => {
    return editor.registerNodeTransform(TextNode, (textNode: TextNode) => {
      let match = getHashtagMatch(textNode.getTextContent());

      let currentNode = textNode;
      while (match !== null) {
        let nodeToReplace: TextNode;
        currentNode.markDirty();

        if (match.start === 0) {
          [nodeToReplace, currentNode] = currentNode.splitText(match.end);
        } else {
          [, nodeToReplace, currentNode] = currentNode.splitText(
            match.start,
            match.end,
          );
        }
        const replacementNode = $createSampleLinkNode(
          nodeToReplace.getTextContent(),
        );
        nodeToReplace.replace(replacementNode);

        match = getHashtagMatch(currentNode.getTextContent());
      }
    });
  }, [editor, getHashtagMatch]);

  return null;
}
