import { join } from 'path';

import { DocumentIcon, FolderOpenIcon } from '@heroicons/react/solid';
import { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Button,
  Card,
  Color,
  Modal,
  SlideOver,
  Spinner,
  Table,
  Td,
  Th,
  useOnOff,
} from '../../components/tailwind-ui';
import {
  DirectoryEntryType,
  useDirectoryTreeLazyQuery,
} from '../../generated/graphql';

interface SelectFolderModalProps {
  returnPath: (path: string) => void;
}

export default function SelectFolderModal({
  returnPath,
}: SelectFolderModalProps) {
  const [isModalOpen, openModal, closeModal] = useOnOff();

  const [selectedPath, _selectPath] = useState('/');

  const selectPath = useCallback(
    (newPath: string) => {
      _selectPath(join(selectedPath, newPath));
    },
    [_selectPath, selectedPath],
  );

  const [getDirectoryTree, { loading, data }] = useDirectoryTreeLazyQuery();

  const directoryList = useMemo(() => {
    if (data === undefined) {
      return undefined;
    }
    const directoryList = [...data.directoryTree];
    directoryList.unshift({ path: '..', type: DirectoryEntryType.DIRECTORY });

    return directoryList
      .filter((entry) => entry.type === DirectoryEntryType.DIRECTORY)
      .map((entry) => ({
        ...entry,
        id: entry.path,
      }));
  }, [data]);

  useEffect(() => {
    getDirectoryTree({ variables: { root: selectedPath } });
  }, [getDirectoryTree, selectedPath]);

  return (
    <>
      <Button onClick={openModal}>Select root</Button>
      <SlideOver isOpen={isModalOpen}>
        <SlideOver.Header>
          <h2 className="text-lg font-semibold text-neutral-900">
            Select folder
          </h2>
        </SlideOver.Header>
        <div>{selectedPath}</div>
        <SlideOver.Content>
          {loading || data === undefined ? (
            <Spinner className="text-danger-500 h-10 w-10" />
          ) : (
            <Table
              Header={Header(selectedPath)}
              data={directoryList as any[]}
              Tr={Row(selectPath)}
            />
          )}
        </SlideOver.Content>
        <SlideOver.Footer>
          <Button onClick={closeModal}>Cancel</Button>
          <Button
            onClick={() => {
              returnPath(selectedPath);
              closeModal();
            }}
          >
            Validate
          </Button>
        </SlideOver.Footer>
      </SlideOver>
    </>
  );
}

function Header(currentPath: string) {
  return () => (
    <tr>
      <Th colSpan={2} className="normal-case">
        {currentPath}
      </Th>
    </tr>
  );
}

interface RowProps {
  value: {
    id: string;
    path: string;
    type: string;
  };
}

function Row(selectPath: (newPath: string) => void) {
  return ({ value }: RowProps) => (
    <tr
      className="hover:bg-neutral-100 cursor-pointer"
      onClick={() => selectPath(value.path)}
    >
      <Td compact>
        {value.type === 'directory' ? (
          <FolderOpenIcon className="w-5 h-5" />
        ) : (
          <DocumentIcon className="w-5 h-5" />
        )}
      </Td>
      <Td compact>{value.path}</Td>
    </tr>
  );
}
