import {
  ArrowRedo20Regular,
  ArrowUndo20Regular,
  Link20Regular,
  TextBold20Regular,
  TextItalic20Regular,
  TextStrikethrough20Regular,
  TextUnderline20Regular,
} from '@fluentui/react-icons';
import { $isLinkNode, TOGGLE_LINK_COMMAND } from '@lexical/link';
import { $isListNode, ListNode } from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $isHeadingNode } from '@lexical/rich-text';
import { $getNearestNodeOfType, mergeRegister } from '@lexical/utils';
import {
  CAN_REDO_COMMAND,
  CAN_UNDO_COMMAND,
  REDO_COMMAND,
  UNDO_COMMAND,
  SELECTION_CHANGE_COMMAND,
  FORMAT_TEXT_COMMAND,
  $getSelection,
  $isRangeSelection,
  $isTextNode,
} from 'lexical';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';

import { Button, Variant } from '@/components/tailwind-ui';
import { useSampleLinkContext } from '@/pages/notebook/hooks/useSampleLinkContext';

import { AlignOptionsDropdown } from '../components/AlignOptionsDropdown';
import { BlockOptionsDropdown } from '../components/BlockOptionsDropdown';
import { ButtonCommand } from '../components/ButtonCommand';
import {
  FloatingLinkEditor,
  getSelectedNode,
} from '../components/FloatingLinkEditor';
import { InsertOptionsMenu } from '../components/InsertOptionsMenu';

const LowPriority = 1;

export default function ToolbarPlugin() {
  const [editor] = useLexicalComposerContext();
  const { openModal } = useSampleLinkContext();
  const toolbarRef = useRef(null);
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);
  const [blockType, setBlockType] = useState('paragraph');
  const [alignType, setAlignType] = useState('left');

  const [isLink, setIsLink] = useState(false);
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [isUnderline, setIsUnderline] = useState(false);
  const [isStrikeThrough, setIsStrikeThrough] = useState(false);

  const updateToolbar = useCallback(() => {
    const selection = $getSelection();
    if ($isRangeSelection(selection)) {
      const anchorNode = selection.anchor.getNode();
      const element =
        anchorNode.getKey() === 'root'
          ? anchorNode
          : anchorNode.getTopLevelElementOrThrow();
      const elementKey = element.getKey();
      const elementDOM = editor.getElementByKey(elementKey);
      if (elementDOM !== null) {
        if ($isListNode(element)) {
          const parentList = $getNearestNodeOfType<ListNode>(
            anchorNode,
            ListNode,
          );
          const type = parentList ? parentList.getTag() : element.getTag();
          setBlockType(type);
        } else {
          const type = $isHeadingNode(element)
            ? element.getTag()
            : element.getType();
          setBlockType(type);
        }
      }
      // Update text format
      setIsBold(selection.hasFormat('bold'));
      setIsItalic(selection.hasFormat('italic'));
      setIsUnderline(selection.hasFormat('underline'));
      setIsStrikeThrough(selection.hasFormat('strikethrough'));

      // Update links
      const node = getSelectedNode(selection);
      const parent = node.getParent();
      setIsLink($isLinkNode(parent) || $isLinkNode(node));
      setAlignType(
        parent?.getFormatType() ||
          (!$isTextNode(node) && node.getFormatType()) ||
          'left',
      );
    }
  }, [editor]);

  useEffect(() => {
    return mergeRegister(
      editor.registerUpdateListener(({ editorState }) => {
        editorState.read(() => updateToolbar());
      }),
      editor.registerCommand(
        SELECTION_CHANGE_COMMAND,
        () => {
          updateToolbar();
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand<boolean>(
        CAN_UNDO_COMMAND,
        (payload) => {
          setCanUndo(payload);
          return false;
        },
        LowPriority,
      ),
      editor.registerCommand<boolean>(
        CAN_REDO_COMMAND,
        (payload) => {
          setCanRedo(payload);
          return false;
        },
        LowPriority,
      ),
    );
  }, [editor, updateToolbar]);

  return (
    <div
      className="my-2 flex flex-row flex-wrap gap-2 divide-x divide-neutral-200"
      ref={toolbarRef}
    >
      <div className="flex flex-row gap-2">
        <ButtonCommand
          title="Undo"
          command={[UNDO_COMMAND, undefined]}
          disabled={!canUndo}
        >
          <ArrowUndo20Regular />
        </ButtonCommand>
        <ButtonCommand
          title="Redo"
          command={[REDO_COMMAND, undefined]}
          disabled={!canRedo}
        >
          <ArrowRedo20Regular />
        </ButtonCommand>
      </div>

      <div className="pl-2">
        <BlockOptionsDropdown blockType={blockType} />
      </div>

      <div className="flex flex-row gap-2 pl-2">
        <ButtonCommand
          title="Format bold"
          command={[FORMAT_TEXT_COMMAND, 'bold']}
          active={isBold}
        >
          <TextBold20Regular />
        </ButtonCommand>
        <ButtonCommand
          title="Format italic"
          command={[FORMAT_TEXT_COMMAND, 'italic']}
          active={isItalic}
        >
          <TextItalic20Regular />
        </ButtonCommand>
        <ButtonCommand
          title="Format underline"
          command={[FORMAT_TEXT_COMMAND, 'underline']}
          active={isUnderline}
        >
          <TextUnderline20Regular />
        </ButtonCommand>
        <ButtonCommand
          title="Format strike through"
          command={[FORMAT_TEXT_COMMAND, 'strikethrough']}
          active={isStrikeThrough}
        >
          <TextStrikethrough20Regular />
        </ButtonCommand>
        <ButtonCommand
          title="Insert link"
          command={[TOGGLE_LINK_COMMAND, !isLink ? 'https://' : undefined]}
          active={isLink}
        >
          <Link20Regular />
        </ButtonCommand>
        {isLink && createPortal(<FloatingLinkEditor />, document.body)}
      </div>
      <div className="pl-2">
        <AlignOptionsDropdown alignType={alignType} />
      </div>
      {openModal ? (
        <div className="pl-2">
          <Button variant={Variant.secondary} onClick={openModal}>
            Inventory
          </Button>
        </div>
      ) : null}

      <div className="pl-2">
        <InsertOptionsMenu />
      </div>
    </div>
  );
}
