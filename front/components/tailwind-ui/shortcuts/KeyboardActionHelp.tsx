import React, { useContext, useMemo } from 'react';

import { useGlobalKeyboardActions } from '../hooks/globalKeyboardActions';
import { useOnOff } from '../hooks/useOnOff';
import { TrProps, Table, Td } from '../lists/Table';
import { Modal } from '../overlays/Modal';
import { SvgOutlineInformationCircle } from '../svg/heroicon/outline';
import { Color } from '../types';
import { commandKeyExists } from '../util';

import { context } from './KeyboardActionContext';
import { KeyboardActionState } from './KeyboardActionProvider';

export interface KeyboardActionHelpProps {
  key?: string;
  alt?: boolean;
}

export function KeyboardActionHelp(props: KeyboardActionHelpProps) {
  const { key = '?', alt = false } = props;
  const [showHelp, helpOn, helpOff] = useOnOff();

  const helpActions = useMemo(() => {
    return [
      {
        description: 'Show keyboard shortcut documentation',
        handler: helpOn,
        alt,
        keys: [key],
      },
    ];
  }, [helpOn, key, alt]);

  useGlobalKeyboardActions(helpActions);

  const { actions } = useContext(context);

  return (
    <Modal
      isOpen={showHelp}
      onRequestClose={helpOff}
      icon={<SvgOutlineInformationCircle />}
      iconColor={Color.primary}
      fluid
    >
      <Modal.Header>Keyboard shortcut documentation</Modal.Header>
      <Modal.Body>
        <Table data={actions} Tr={Tr} />
      </Modal.Body>
    </Modal>
  );
}

function Tr(props: TrProps<KeyboardActionState>) {
  return (
    <tr>
      <Td>
        {props.value.keys.map((key, index) => (
          <>
            {props.value.cmdKey === true && (
              <>
                <kbd>{commandKeyExists ? 'Cmd' : 'Ctrl'}</kbd>+
              </>
            )}
            <kbd key={key}>{key}</kbd>
            {index < props.value.keys.length - 1 ? ' or ' : ''}
          </>
        ))}
      </Td>
      <Td align="right">{props.value.description}</Td>
    </tr>
  );
}
