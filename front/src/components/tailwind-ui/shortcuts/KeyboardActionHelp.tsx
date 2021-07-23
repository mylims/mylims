import { InformationCircleIcon } from '@heroicons/react/outline';
import React, { useMemo } from 'react';
import {
  KbsDefinition,
  KbsKeyDefinition,
  KbsShortcut,
  useKbsGlobal,
  useKbsGlobalList,
} from 'react-kbs';

import { useOnOff } from '../hooks/useOnOff';
import { TrProps, Table, Td } from '../lists/Table';
import { Modal } from '../overlays/Modal';
import { Color } from '../types';
import { commandKeyExists } from '../util';

export interface KeyboardActionHelpProps {
  shortcut?: KbsKeyDefinition;
}

const defaultShortcut = { key: '?' };

export function KeyboardActionHelp(props: KeyboardActionHelpProps) {
  const { shortcut = defaultShortcut } = props;
  const [showHelp, helpOn, helpOff] = useOnOff();

  const helpActions = useMemo<Array<KbsDefinition>>(() => {
    return [
      {
        shortcut,
        meta: {
          description: 'Show this documentation',
        },
        handler: () => helpOn(),
      },
    ];
  }, [helpOn, shortcut]);

  useKbsGlobal(helpActions);

  const actions = useKbsGlobalList();
  const shortcuts = actions.map((shortcut, index) => ({
    id: index,
    ...shortcut,
  }));

  return (
    <Modal
      isOpen={showHelp}
      onRequestClose={helpOff}
      icon={<InformationCircleIcon />}
      iconColor={Color.primary}
      fluid
    >
      <Modal.Header>Keyboard shortcut documentation</Modal.Header>
      <Modal.Body>
        <Table data={shortcuts} Tr={Tr} />
      </Modal.Body>
    </Modal>
  );
}

function Tr({ value }: TrProps<KbsShortcut>) {
  return (
    <tr>
      <Td className="flex flex-row gap-1">
        <KbdLine kbs={value.shortcut} />
        {value.aliases.length > 0 ? ',' : ''}

        {value.aliases.map((alias, index) => (
          <>
            <KbdLine key={alias.key} kbs={alias} />
            {index < value.aliases.length - 1 ? ',' : ''}
          </>
        ))}
      </Td>
      <Td align="right">{value.meta?.description}</Td>
    </tr>
  );
}

interface KbdLineProps {
  kbs: KbsKeyDefinition;
}

function KbdLine(props: KbdLineProps) {
  const { key, alt, ctrl, shift } = props.kbs;
  return (
    <kbd className="text-sm font-light leading-3 text-neutral-700">
      {ctrl && renderModifierKey('ctrl')}
      {alt && renderModifierKey('alt')}
      {shift && renderModifierKey('shift')}
      {keyToLabel(key)}
    </kbd>
  );
}

// Correct alignment for some keys that render too high otherwise and use smaller
// gap than with plain text.
const modifierMap = {
  ctrl: <span className="mr-0.5 align-text-bottom">⌘</span>,
  alt: <span className="mr-0.5 align-text-bottom">⌥</span>,
  shift: <span className="mr-0.5">⇧</span>,
};

function renderModifierKey(key: 'ctrl' | 'alt' | 'shift') {
  if (commandKeyExists) {
    return modifierMap[key];
  } else {
    return `${key} `;
  }
}

function keyToLabel(key: string): string {
  switch (key) {
    case 'arrowleft':
      return '←';
    case 'arrowright':
      return '→';
    case 'arrowup':
      return '↑';
    case 'arrowdown':
      return '↓';
    default:
      return key;
  }
}
