import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { FORMAT_ELEMENT_COMMAND } from 'lexical';
import React, { useMemo } from 'react';

import { Select } from '@/components/tailwind-ui';

import { DivButtonCommand } from './ButtonCommand';

type AlignType = Record<'value' | 'label', string>;

const ALIGN_TYPES: AlignType[] = [
  { value: 'left', label: 'Left align' },
  { value: 'center', label: 'Center align' },
  { value: 'right', label: 'Right align' },
  { value: 'justify', label: 'Justify align' },
];

interface AlignOptionsDropdownProps {
  alignType: string;
}
export function AlignOptionsDropdown({ alignType }: AlignOptionsDropdownProps) {
  const [editor] = useLexicalComposerContext();
  const selected = useMemo(
    () => ALIGN_TYPES.find(({ value }) => value === alignType),
    [alignType],
  );

  return (
    <Select<AlignType>
      className="w-36"
      highlightClassName="text-white bg-primary-600"
      label="Align options"
      aria-label="Align options"
      placeholder="Align options"
      hiddenLabel
      onSelect={() => editor.focus()}
      options={ALIGN_TYPES}
      selected={selected}
      renderOption={(option: AlignType) => (
        <DivButtonCommand command={[FORMAT_ELEMENT_COMMAND, option.value]}>
          {option.label}
        </DivButtonCommand>
      )}
    />
  );
}
