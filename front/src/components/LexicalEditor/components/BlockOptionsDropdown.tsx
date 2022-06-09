import {
  INSERT_ORDERED_LIST_COMMAND,
  INSERT_UNORDERED_LIST_COMMAND,
} from '@lexical/list';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { $createHeadingNode, $createQuoteNode } from '@lexical/rich-text';
import { $createParagraphNode, ElementNode, LexicalCommand } from 'lexical';
import React, { useMemo } from 'react';

import { Select } from '@/components/tailwind-ui';

import { ButtonFormat } from './ButtonFormat';
import { ButtonFormatList } from './ButtonFormatList';

type Options = Record<'value' | 'label', string>;
type BlockNodeType = Options & { createElement(): ElementNode };
type BlockListType = Options & { insert: LexicalCommand<void> };
type BlockType = BlockNodeType | BlockListType;

const BLOCK_NODE_TYPES: BlockNodeType[] = [
  {
    value: 'paragraph',
    label: 'Normal',
    createElement: () => $createParagraphNode(),
  },
  {
    value: 'h1',
    label: 'Large heading',
    createElement: () => $createHeadingNode('h1'),
  },
  {
    value: 'h2',
    label: 'Small heading',
    createElement: () => $createHeadingNode('h2'),
  },
  { value: 'quote', label: 'Quote', createElement: () => $createQuoteNode() },
];
const BLOCK_LIST_TYPES: BlockListType[] = [
  { value: 'ul', label: 'Bullet list', insert: INSERT_UNORDERED_LIST_COMMAND },
  { value: 'ol', label: 'Number list', insert: INSERT_ORDERED_LIST_COMMAND },
];
const BLOCK_TYPES: BlockType[] = [...BLOCK_NODE_TYPES, ...BLOCK_LIST_TYPES];

function isInsert(blockType: BlockType): blockType is BlockListType {
  return (blockType as BlockListType).insert !== undefined;
}

interface BlockOptionsDropdownProps {
  blockType: string;
}
export function BlockOptionsDropdown({ blockType }: BlockOptionsDropdownProps) {
  const [editor] = useLexicalComposerContext();
  const select = useMemo(
    () => BLOCK_TYPES.find(({ value }) => value === blockType),
    [blockType],
  );

  return (
    <Select<BlockType>
      className="w-36"
      highlightClassName="text-white bg-primary-600"
      label="Formatting options"
      aria-label="Formatting options"
      placeholder="Formatting options"
      hiddenLabel
      onSelect={() => editor.focus()}
      // @ts-expect-error (A|B)[] != (A[]|B[])
      options={BLOCK_TYPES}
      selected={select}
      renderOption={(option: BlockType) => {
        if (isInsert(option)) {
          return (
            <ButtonFormatList
              title={option.label}
              isActive={blockType === option.value}
              insert={option.insert}
            />
          );
        }
        return (
          <ButtonFormat
            title={option.label}
            isActive={blockType === option.value}
            createElement={() => option.createElement()}
          />
        );
      }}
    />
  );
}
