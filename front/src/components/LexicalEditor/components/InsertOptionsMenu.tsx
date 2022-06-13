import { Menu, Transition } from '@headlessui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import clsx from 'clsx';
import { LexicalCommand } from 'lexical';
import React, { createContext, Fragment, useContext, useState } from 'react';
import { KbsProvider } from 'react-kbs';

import { Button, Color, Modal, Variant } from '@/components/tailwind-ui';

import { INSERT_EQUATION_COMMAND } from '../plugins/EquationsPlugin';

import { EquationModal } from './EquationModal';

interface InsertModalState {
  state: unknown | null;
  setState: (action: unknown) => void;
}
interface InsertOption {
  label: string;
  modal: React.ReactNode;
  command(val: unknown | null): [LexicalCommand<void>, unknown];
}
const InsertModalContext = createContext<InsertModalState>({
  state: null,
  setState: () => {
    throw new Error('Function not implemented');
  },
});
export function useInsertModalContext() {
  const context = useContext(InsertModalContext);
  if (!context) {
    throw new Error(
      'useInsertModalContext called outside of InsertModal context',
    );
  }
  return context;
}

export function InsertOptionsMenu() {
  const [modal, setModal] = useState<InsertOption | null>(null);
  const [state, setState] = useState<unknown | null>(null);
  const [editor] = useLexicalComposerContext();
  const INSERT_OPTIONS: InsertOption[] = [
    {
      label: 'Equation',
      modal: <EquationModal />,
      command: (val) => [
        INSERT_EQUATION_COMMAND,
        { equation: val ?? '', inline: false },
      ],
    },
  ];

  return (
    <InsertModalContext.Provider value={{ state, setState }}>
      <KbsProvider>
        <Menu as="div">
          <Menu.Button as={Button} variant={Variant.white} className="relative">
            + Insert
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute z-10 mt-2 w-36 max-h-60 overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {INSERT_OPTIONS.map((option) => (
                <Menu.Item key={option.label}>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => setModal(option)}
                      className={clsx(
                        'group flex w-full items-center px-2 py-2 text-sm',
                        {
                          'bg-primary-500 text-white': active,
                          'text-neutral-900': !active,
                        },
                      )}
                    >
                      {option.label}
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
        <Modal isOpen={modal !== null} onRequestClose={() => setModal(null)}>
          <Modal.Body>{modal?.modal}</Modal.Body>
          <Modal.Footer align="right">
            <Button
              color={Color.danger}
              variant={Variant.secondary}
              onClick={() => {
                setState(null);
                setModal(null);
              }}
            >
              Cancel
            </Button>
            <Button
              color={Color.success}
              variant={Variant.secondary}
              disabled={!modal}
              onClick={() => {
                if (modal) {
                  editor.focus();
                  editor.dispatchCommand(...modal.command(state));
                  setModal(null);
                }
              }}
            >
              Insert
            </Button>
          </Modal.Footer>
        </Modal>
      </KbsProvider>
    </InsertModalContext.Provider>
  );
}
