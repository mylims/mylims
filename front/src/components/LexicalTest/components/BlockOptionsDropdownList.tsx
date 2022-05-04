import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createParagraphNode } from 'lexical';
import React, { useEffect, useRef } from 'react';

import { ButtonFormat } from './ButtonFormat';
import { ButtonFormatList } from './ButtonFormatList';

interface BlockOptionsDropdownListProps {
  blockType: string;
  toolbarRef: React.RefObject<HTMLDivElement>;
  setShowBlockOptionsDropDown: React.Dispatch<React.SetStateAction<boolean>>;
}
export function BlockOptionsDropdownList({
  blockType,
  toolbarRef,
  setShowBlockOptionsDropDown,
}: BlockOptionsDropdownListProps) {
  const dropDownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const toolbar = toolbarRef.current;
    const dropDown = dropDownRef.current;

    if (toolbar !== null && dropDown !== null) {
      const { top, left } = toolbar.getBoundingClientRect();
      dropDown.style.top = `${top + 40}px`;
      dropDown.style.left = `${left}px`;
    }
  }, [dropDownRef, toolbarRef]);

  useEffect(() => {
    const dropDown = dropDownRef.current;
    const toolbar = toolbarRef.current;

    if (dropDown !== null && toolbar !== null) {
      const handle = (event: MouseEvent) => {
        const target = event.target;

        // @ts-expect-error An event target is not a Node element itself.
        if (!dropDown.contains(target) && !toolbar.contains(target)) {
          setShowBlockOptionsDropDown(false);
        }
      };
      document.addEventListener('click', handle);

      return () => {
        document.removeEventListener('click', handle);
      };
    }
  }, [dropDownRef, setShowBlockOptionsDropDown, toolbarRef]);

  return (
    <div className="dropdown" ref={dropDownRef}>
      <ButtonFormat
        title="Normal"
        isActive={blockType === 'paragraph'}
        onClick={setShowBlockOptionsDropDown}
        createElement={() => $createParagraphNode()}
      />
      <ButtonFormat
        title="Large Heading"
        isActive={blockType === 'h1'}
        onClick={setShowBlockOptionsDropDown}
        createElement={() => $createHeadingNode('h1')}
      />
      <ButtonFormat
        title="Small Heading"
        isActive={blockType === 'h2'}
        onClick={setShowBlockOptionsDropDown}
        createElement={() => $createHeadingNode('h2')}
      />
      <ButtonFormatList
        title="Bullet List"
        isActive={blockType === 'ul'}
        onClick={setShowBlockOptionsDropDown}
        insert={INSERT_UNORDERED_LIST_COMMAND}
      />
      <ButtonFormatList
        title="Number List"
        isActive={blockType === 'ol'}
        onClick={setShowBlockOptionsDropDown}
        insert={INSERT_ORDERED_LIST_COMMAND}
      />
      <ButtonFormat
        title="Quote"
        isActive={blockType === 'quote'}
        onClick={setShowBlockOptionsDropDown}
        createElement={() => $createQuoteNode()}
      />
    </div>
  );
}
