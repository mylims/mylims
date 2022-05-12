import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import useLexicalTextEntity from '@lexical/react/useLexicalTextEntity';
import { createCommand, LexicalCommand, TextNode } from 'lexical';
import React, { useCallback, useEffect, useReducer } from 'react';
import { createPortal } from 'react-dom';

import { SampleLink } from '@/components/LexicalTest/components/SampleLink';

import { $createSampleLinkNode, SampleLinkNode } from '../models/SampleLink';

const REGEX = /(?<sampleCode>[#\uFF03][A-z0-9_]+)/i;

function upsertWrapperToBody(wrapperId: string) {
  let element = document.getElementById(wrapperId);
  if (element) return element;
  const wrapperElement = document.createElement('div');
  wrapperElement.setAttribute('id', wrapperId);
  document.body.appendChild(wrapperElement);
  return wrapperElement;
}

type ActionType =
  | { type: 'created'; key: string }
  | { type: 'destroyed'; key: string };
function reducer(state: string[], action: ActionType) {
  switch (action.type) {
    case 'created':
      return [...state, action.key];
    case 'destroyed':
      return state.filter((key) => key !== action.key);
    default:
      return state;
  }
}

export type InsertSampleLinkPayload = Readonly<{
  id: string;
  type: string;
  sampleCode: string;
}>;
export const INSERT_SAMPLE_LINK_COMMAND: LexicalCommand<InsertSampleLinkPayload> =
  createCommand();
export default function SampleLinkPlugin() {
  const [editor] = useLexicalComposerContext();
  const [state, dispatch] = useReducer(reducer, []);

  useEffect(() => {
    if (!editor.hasNodes([SampleLinkNode])) {
      throw new Error('HashtagPlugin: SampleLinkNode not registered on editor');
    }
  }, [editor]);

  const createSampleLinkNode = useCallback(
    (textNode: TextNode) =>
      $createSampleLinkNode('t', 't', textNode.getTextContent()),
    [],
  );

  const getHashtagMatch = useCallback((text: string) => {
    const matchArr = REGEX.exec(text);
    if (matchArr === null) {
      return null;
    }
    const hashtagLen = matchArr.groups?.sampleCode.length ?? 1;
    return {
      end: hashtagLen + matchArr.index,
      start: matchArr.index,
    };
  }, []);

  useLexicalTextEntity<SampleLinkNode>(
    getHashtagMatch,
    SampleLinkNode,
    createSampleLinkNode,
  );

  // createPortal(<SampleLink />, document.body);
  useEffect(() => {
    return editor.registerMutationListener(SampleLinkNode, (mutatedNodes) => {
      for (let [key, type] of mutatedNodes) dispatch({ key, type });
    });
  }, [editor, dispatch]);

  return (
    <>
      {state.map((nodeKey) => {
        const element = editor.getElementByKey(nodeKey);
        if (!element) return null;
        const wrapper = upsertWrapperToBody(`${nodeKey}-sample-link`);
        return createPortal(<SampleLink nodeKey={nodeKey} />, wrapper);
      })}
    </>
  );
}
