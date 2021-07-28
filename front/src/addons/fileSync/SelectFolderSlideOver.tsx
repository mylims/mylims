import { DocumentIcon, FolderOpenIcon } from '@heroicons/react/solid';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

import {
  Button,
  SlideOver,
  Spinner,
  Table,
  Td,
  Th,
  useOnOff,
} from '@components/tailwind-ui';


import {
  DirectoryEntryType,
  useDirectoryTreeLazyQuery,
} from './generated/graphql';

interface SelectFolderSlideOverProps {
  returnPath: (path: string) => void;
}

function join(selectedPath: string, newPath: string) {
  const url = new URL(`${selectedPath + newPath }/`, 'https://example.com');
  return url.pathname;
}

export default function SelectFolderSlideOver({
  returnPath,
}: SelectFolderSlideOverProps) {
  const [isSlideOverOpen, openSlideOver, closeSlideOver] = useOnOff();

  const [selectedPath, _selectPath] = useState('/');

  const selectPath = useCallback(
    (newPath: string) => {
      _selectPath((selectedPath) => join(selectedPath, newPath));
    },
    [_selectPath],
  );

  const [getDirectoryTree, { loading, data }] = useDirectoryTreeLazyQuery();

  const directoryList = useMemo(() => {
    if (data === undefined) {
      return [];
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
      <Button onClick={openSlideOver}>Select root</Button>
      <SlideOver isOpen={isSlideOverOpen}>
        <SlideOver.Header>
          <h2 className="text-lg font-semibold text-neutral-900">
            Select folder
          </h2>
        </SlideOver.Header>
        <div>{selectedPath}</div>
        <SlideOver.Content>
          {loading || data === undefined ? (
            <Spinner className="w-10 h-10 text-danger-500" />
          ) : (
            <Table
              Header={Header(selectedPath)}
              data={directoryList}
              Tr={Row(selectPath)}
            />
          )}
        </SlideOver.Content>
        <SlideOver.Footer>
          <Button onClick={closeSlideOver}>Cancel</Button>
          <Button
            onClick={() => {
              returnPath(selectedPath);
              closeSlideOver();
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
      className="cursor-pointer hover:bg-neutral-100"
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
