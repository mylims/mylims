import {
  Beaker20Regular,
  BracesVariable20Regular,
  DataTrending20Regular,
  Image20Regular,
  Table20Regular,
} from '@fluentui/react-icons';
import { Menu, Transition } from '@headlessui/react';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import { INSERT_TABLE_COMMAND } from '@lexical/table';
import { clsx } from 'clsx';
import { $getRoot, LexicalCommand, ParagraphNode } from 'lexical';
import React, {
  createContext,
  Fragment,
  useContext,
  useMemo,
  useState,
} from 'react';
import { KbsProvider } from 'react-kbs';

import { Button, Color, Modal, Variant } from '@/components/tailwind-ui';

import { $createPlotNode } from '../nodes/PlotNode';
import { $createSampleLinkNode } from '../nodes/SampleLinkNode';
import { INSERT_EQUATION_COMMAND } from '../plugins/EquationsPlugin';
import { INSERT_IMAGE_COMMAND } from '../plugins/ImagesPlugin';

import { EquationModal } from './modals/EquationModal';
import { ImageModal, ImageState } from './modals/ImageModal';
import { MeasurementLinkModal } from './modals/MeasurementLinkModal';
import { SampleLinkModal } from './modals/SampleLinkModal';
import { TableModal } from './modals/TableModal';

interface InsertModalState {
  state: unknown | null;
  setState: (action: unknown) => void;
}
interface InsertOption {
  icon: React.ReactNode;
  label: string;
  modal: React.ReactNode;
  command: ((val: unknown | null) => [LexicalCommand<void>, unknown]) | null;
  extension?: boolean;
}
const InsertModalContext = createContext<InsertModalState>({
  state: null,
  setState() {
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

export function InsertOptionsMenu({ extended }: { extended: boolean }) {
  const [modal, setModal] = useState<InsertOption | null>(null);
  const [state, setState] = useState<unknown | null>(null);
  const [editor] = useLexicalComposerContext();
  const INSERT_OPTIONS: InsertOption[] = useMemo(
    () => [
      {
        icon: <BracesVariable20Regular />,
        label: 'Equation',
        modal: <EquationModal />,
        command(val) {
          return [
            INSERT_EQUATION_COMMAND,
            { equation: val ?? '', inline: false },
          ];
        },
      },
      {
        icon: <Image20Regular />,
        label: 'Image',
        modal: <ImageModal />,
        command(val: ImageState) {
          return [
            INSERT_IMAGE_COMMAND,
            { src: val.file, altText: val.altText },
          ];
        },
      },
      {
        icon: <Table20Regular />,
        label: 'Table',
        modal: <TableModal />,
        command(val) {
          return [INSERT_TABLE_COMMAND, val];
        },
      },
      {
        icon: <Beaker20Regular />,
        label: 'Inventory',
        modal: (
          <SampleLinkModal
            appendSample={(id: string) => {
              editor.update(() => {
                const root = $getRoot();
                const latest = root.getLastChild();
                const node = $createSampleLinkNode(id);
                if (latest instanceof ParagraphNode) {
                  latest.append(node);
                } else {
                  root.append(node);
                }
              });
              setModal(null);
            }}
          />
        ),
        command: null,
        extension: true,
      },
      {
        icon: <DataTrending20Regular />,
        label: 'Measurements',
        modal: (
          <MeasurementLinkModal
            appendMeasurement={(fileId: string, fileUrl: string) => {
              // Append the plot to the editor
              editor.update(() => {
                const root = $getRoot();
                const latest = root.getLastChild();
                const node = $createPlotNode(fileId, fileUrl);
                if (latest instanceof ParagraphNode) {
                  latest.append(node);
                } else {
                  root.append(node);
                }
              });
              setModal(null);
            }}
          />
        ),
        command: null,
        extension: true,
      },
    ],
    [editor],
  );

  const insertOptions = useMemo(() => {
    if (extended) return INSERT_OPTIONS;
    return INSERT_OPTIONS.filter((option) => !option.extension);
  }, [INSERT_OPTIONS, extended]);

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
            <Menu.Items className="absolute z-10 mt-2 max-h-60 w-44 overflow-auto rounded-md bg-white py-1 text-base ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
              {insertOptions.map((option) => (
                <Menu.Item key={option.label}>
                  {({ active }) => (
                    <button
                      type="button"
                      onClick={() => setModal(option)}
                      className={clsx(
                        'group flex w-full items-center px-4 py-2 text-sm',
                        {
                          'bg-primary-500 text-white': active,
                          'text-neutral-900': !active,
                        },
                      )}
                    >
                      {option.icon}
                      <span className="ml-2">{option.label}</span>
                    </button>
                  )}
                </Menu.Item>
              ))}
            </Menu.Items>
          </Transition>
        </Menu>
        <Modal isOpen={modal !== null} onRequestClose={() => setModal(null)}>
          <Modal.Body>{modal?.modal}</Modal.Body>
          {modal?.command && (
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
                  if (modal?.command) {
                    editor.focus();
                    editor.dispatchCommand<LexicalCommand<unknown>, unknown>(
                      ...modal.command(state),
                    );
                    setModal(null);
                  }
                }}
              >
                Insert
              </Button>
            </Modal.Footer>
          )}
        </Modal>
      </KbsProvider>
    </InsertModalContext.Provider>
  );
}
