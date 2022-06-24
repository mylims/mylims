import { ChevronDownIcon } from '@heroicons/react/outline';
import { useLexicalComposerContext } from '@lexical/react/LexicalComposerContext';
import {
  $deleteTableColumn,
  $getElementGridForTableNode,
  $getTableCellNodeFromLexicalNode,
  $getTableColumnIndexFromTableCellNode,
  $getTableNodeFromLexicalNodeOrThrow,
  $getTableRowIndexFromTableCellNode,
  $insertTableColumn,
  $insertTableRow,
  $isTableCellNode,
  $isTableRowNode,
  $removeTableRowAtIndex,
  getTableSelectionFromTableElement,
  TableCellHeaderStates,
  TableCellNode,
} from '@lexical/table';
import {
  $getSelection,
  $isGridSelection,
  $isRangeSelection,
  $setSelection,
} from 'lexical';
import React, {
  ReactPortal,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';

type TableCellActionMenuProps = Readonly<{
  contextRef: { current: null | HTMLElement };
  onClose(): void;
  setIsMenuOpen(value: boolean): void;
  tableCellNode: TableCellNode;
}>;

function TableActionMenu({
  onClose,
  tableCellNode: _tableCellNode,
  setIsMenuOpen,
  contextRef,
}: TableCellActionMenuProps) {
  const [editor] = useLexicalComposerContext();
  const dropDownRef = useRef<HTMLDivElement>(null);
  const [tableCellNode, updateTableCellNode] = useState(_tableCellNode);
  const [selectionCounts, updateSelectionCounts] = useState({
    columns: 1,
    rows: 1,
  });

  useEffect(() => {
    return editor.registerMutationListener(TableCellNode, (nodeMutations) => {
      const nodeUpdated =
        nodeMutations.get(tableCellNode.getKey()) === 'updated';

      if (nodeUpdated) {
        editor.getEditorState().read(() => {
          updateTableCellNode(tableCellNode.getLatest());
        });
      }
    });
  }, [editor, tableCellNode]);

  useEffect(() => {
    editor.getEditorState().read(() => {
      const selection = $getSelection();

      if ($isGridSelection(selection)) {
        const selectionShape = selection.getShape();

        updateSelectionCounts({
          columns: selectionShape.toX - selectionShape.fromX + 1,
          rows: selectionShape.toY - selectionShape.fromY + 1,
        });
      }
    });
  }, [editor]);

  useEffect(() => {
    const menuButtonElement = contextRef.current;
    const dropDownElement = dropDownRef.current;

    if (menuButtonElement != null && dropDownElement != null) {
      const { left, width, top } = menuButtonElement.getBoundingClientRect();
      dropDownElement.style.opacity = '1';
      dropDownElement.style.left = `${left + width + window.pageXOffset + 5}px`;
      dropDownElement.style.top = `${top + window.pageYOffset}px`;
    }
  }, [contextRef, dropDownRef]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropDownRef.current != null &&
        contextRef.current != null &&
        event.target instanceof Node &&
        !dropDownRef.current.contains(event.target) &&
        !contextRef.current.contains(event.target)
      ) {
        setIsMenuOpen(false);
      }
    }

    window.addEventListener('click', handleClickOutside);

    return () => window.removeEventListener('click', handleClickOutside);
  }, [setIsMenuOpen, contextRef]);

  const clearTableSelection = useCallback(() => {
    editor.update(() => {
      if (tableCellNode.isAttached()) {
        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
        const tableElement = editor.getElementByKey(tableNode.getKey());

        if (!tableElement) {
          throw new Error('Expected to find tableElement in DOM');
        }

        const tableSelection = getTableSelectionFromTableElement(tableElement);
        tableSelection.clearHighlight();

        tableNode.markDirty();
        updateTableCellNode(tableCellNode.getLatest());
      }

      $setSelection(null);
    });
  }, [editor, tableCellNode]);

  const insertTableRowAtSelection = useCallback(
    (shouldInsertAfter) => {
      editor.update(() => {
        const selection = $getSelection();

        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

        let tableRowIndex;

        if ($isGridSelection(selection)) {
          const selectionShape = selection.getShape();
          tableRowIndex = shouldInsertAfter
            ? selectionShape.toY
            : selectionShape.fromY;
        } else {
          tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);
        }

        const grid = $getElementGridForTableNode(editor, tableNode);

        $insertTableRow(
          tableNode,
          tableRowIndex,
          shouldInsertAfter,
          selectionCounts.rows,
          grid,
        );

        clearTableSelection();

        onClose();
      });
    },
    [editor, tableCellNode, selectionCounts.rows, clearTableSelection, onClose],
  );

  const insertTableColumnAtSelection = useCallback(
    (shouldInsertAfter) => {
      editor.update(() => {
        const selection = $getSelection();

        const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

        let tableColumnIndex;

        if ($isGridSelection(selection)) {
          const selectionShape = selection.getShape();
          tableColumnIndex = shouldInsertAfter
            ? selectionShape.toX
            : selectionShape.fromX;
        } else {
          tableColumnIndex =
            $getTableColumnIndexFromTableCellNode(tableCellNode);
        }

        $insertTableColumn(
          tableNode,
          tableColumnIndex,
          shouldInsertAfter,
          selectionCounts.columns,
        );

        clearTableSelection();

        onClose();
      });
    },
    [
      editor,
      tableCellNode,
      selectionCounts.columns,
      clearTableSelection,
      onClose,
    ],
  );

  const deleteTableRowAtSelection = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
      const tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);

      $removeTableRowAtIndex(tableNode, tableRowIndex);

      clearTableSelection();
      onClose();
    });
  }, [editor, tableCellNode, clearTableSelection, onClose]);

  const deleteTableAtSelection = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);
      tableNode.remove();

      clearTableSelection();
      onClose();
    });
  }, [editor, tableCellNode, clearTableSelection, onClose]);

  const deleteTableColumnAtSelection = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

      const tableColumnIndex =
        $getTableColumnIndexFromTableCellNode(tableCellNode);

      $deleteTableColumn(tableNode, tableColumnIndex);

      clearTableSelection();
      onClose();
    });
  }, [editor, tableCellNode, clearTableSelection, onClose]);

  const toggleTableRowIsHeader = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

      const tableRowIndex = $getTableRowIndexFromTableCellNode(tableCellNode);

      const tableRows = tableNode.getChildren();

      if (tableRowIndex >= tableRows.length || tableRowIndex < 0) {
        throw new Error('Expected table cell to be inside of table row.');
      }

      const tableRow = tableRows[tableRowIndex];

      if (!$isTableRowNode(tableRow)) {
        throw new Error('Expected table row');
      }

      tableRow.getChildren().forEach((tableCell) => {
        if (!$isTableCellNode(tableCell)) {
          throw new Error('Expected table cell');
        }

        tableCell.toggleHeaderStyle(TableCellHeaderStates.ROW);
      });

      clearTableSelection();
      onClose();
    });
  }, [editor, tableCellNode, clearTableSelection, onClose]);

  const toggleTableColumnIsHeader = useCallback(() => {
    editor.update(() => {
      const tableNode = $getTableNodeFromLexicalNodeOrThrow(tableCellNode);

      const tableColumnIndex =
        $getTableColumnIndexFromTableCellNode(tableCellNode);

      const tableRows = tableNode.getChildren();

      for (const tableRow of tableRows) {
        if (!$isTableRowNode(tableRow)) {
          throw new Error('Expected table row');
        }

        const tableCells = tableRow.getChildren();

        if (tableColumnIndex >= tableCells.length || tableColumnIndex < 0) {
          throw new Error('Expected table cell to be inside of table row.');
        }

        const tableCell = tableCells[tableColumnIndex];

        if (!$isTableCellNode(tableCell)) {
          throw new Error('Expected table cell');
        }

        tableCell.toggleHeaderStyle(TableCellHeaderStates.COLUMN);
      }

      clearTableSelection();
      onClose();
    });
  }, [editor, tableCellNode, clearTableSelection, onClose]);

  return createPortal(
    <div
      className="fixed z-10 block min-h-[40px] min-w-[100px] rounded-lg bg-neutral-100 shadow-lg"
      ref={dropDownRef}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <ActionButton onClick={() => insertTableRowAtSelection(false)}>
        Insert{' '}
        {selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`}{' '}
        above
      </ActionButton>
      <ActionButton onClick={() => insertTableRowAtSelection(true)}>
        Insert{' '}
        {selectionCounts.rows === 1 ? 'row' : `${selectionCounts.rows} rows`}{' '}
        below
      </ActionButton>
      <hr />
      <ActionButton onClick={() => insertTableColumnAtSelection(false)}>
        Insert{' '}
        {selectionCounts.columns === 1
          ? 'column'
          : `${selectionCounts.columns} columns`}{' '}
        left
      </ActionButton>
      <ActionButton onClick={() => insertTableColumnAtSelection(true)}>
        Insert{' '}
        {selectionCounts.columns === 1
          ? 'column'
          : `${selectionCounts.columns} columns`}{' '}
        right
      </ActionButton>
      <hr />
      <ActionButton onClick={() => deleteTableColumnAtSelection()}>
        Delete column
      </ActionButton>
      <ActionButton onClick={() => deleteTableRowAtSelection()}>
        Delete row
      </ActionButton>
      <ActionButton onClick={() => deleteTableAtSelection()}>
        Delete table
      </ActionButton>
      <hr />
      <ActionButton onClick={() => toggleTableRowIsHeader()}>
        {(tableCellNode.__headerState & TableCellHeaderStates.ROW) ===
        TableCellHeaderStates.ROW
          ? 'Remove'
          : 'Add'}{' '}
        row header
      </ActionButton>
      <ActionButton onClick={() => toggleTableColumnIsHeader()}>
        {(tableCellNode.__headerState & TableCellHeaderStates.COLUMN) ===
        TableCellHeaderStates.COLUMN
          ? 'Remove'
          : 'Add'}{' '}
        column header
      </ActionButton>
    </div>,
    document.body,
  );
}

interface ActionButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}
function ActionButton({ onClick, children }: ActionButtonProps) {
  return (
    <button
      type="button"
      className="align-center radius-sm my-0 mx-2 flex max-w-[250px] shrink-0 cursor-pointer flex-row justify-between border-0 p-2"
      onClick={onClick}
    >
      <span className="flex min-w-[150px] grow">{children}</span>
    </button>
  );
}

function TableCellActionMenuContainer(): JSX.Element {
  const [editor] = useLexicalComposerContext();

  const menuButtonRef = useRef<HTMLDivElement>(null);
  const menuRootRef = useRef(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const [tableCellNode, setTableMenuCellNode] = useState<TableCellNode | null>(
    null,
  );

  const moveMenu = useCallback(() => {
    const menu = menuButtonRef.current;
    const selection = $getSelection();
    const nativeSelection = window.getSelection();
    const activeElement = document.activeElement;

    if (selection == null || menu == null) {
      setTableMenuCellNode(null);
      return;
    }

    const rootElement = editor.getRootElement();

    if (
      $isRangeSelection(selection) &&
      rootElement !== null &&
      nativeSelection !== null &&
      rootElement.contains(nativeSelection.anchorNode)
    ) {
      const tableCellNodeFromSelection = $getTableCellNodeFromLexicalNode(
        selection.anchor.getNode(),
      );

      if (tableCellNodeFromSelection == null) {
        setTableMenuCellNode(null);
        return;
      }

      const tableCellParentNodeDOM = editor.getElementByKey(
        tableCellNodeFromSelection.getKey(),
      );

      if (tableCellParentNodeDOM == null) {
        setTableMenuCellNode(null);
        return;
      }

      setTableMenuCellNode(tableCellNodeFromSelection);
    } else if (!activeElement) {
      setTableMenuCellNode(null);
    }
  }, [editor]);

  useEffect(() => {
    return editor.registerUpdateListener(() => {
      editor.getEditorState().read(() => moveMenu());
    });
  });

  useEffect(() => {
    const menuButtonDOM = menuButtonRef.current;

    if (menuButtonDOM != null && tableCellNode != null) {
      const tableCellNodeDOM = editor.getElementByKey(tableCellNode.getKey());

      if (tableCellNodeDOM != null) {
        const tableCellRect = tableCellNodeDOM.getBoundingClientRect();
        const menuRect = menuButtonDOM.getBoundingClientRect();

        menuButtonDOM.style.opacity = '1';

        menuButtonDOM.style.left = `${
          tableCellRect.left +
          window.pageXOffset -
          menuRect.width +
          tableCellRect.width -
          10
        }px`;

        menuButtonDOM.style.top = `${
          tableCellRect.top + window.pageYOffset + 5
        }px`;
      } else {
        menuButtonDOM.style.opacity = '0';
      }
    }
  }, [menuButtonRef, tableCellNode, editor]);

  const prevTableCellDOM = useRef(tableCellNode);

  useEffect(() => {
    if (prevTableCellDOM.current !== tableCellNode) {
      setIsMenuOpen(false);
    }

    prevTableCellDOM.current = tableCellNode;
  }, [prevTableCellDOM, tableCellNode]);

  return (
    <div className="absolute" ref={menuButtonRef}>
      {tableCellNode !== null && (
        <>
          <button
            type="button"
            className="radius-sm pointer relative inline-block items-center justify-center border-0 bg-transparent text-neutral-500"
            onClick={(e) => {
              e.stopPropagation();
              setIsMenuOpen(!isMenuOpen);
            }}
            ref={menuRootRef}
          >
            <ChevronDownIcon className="h-5 w-5" />
          </button>
          {isMenuOpen && (
            <TableActionMenu
              contextRef={menuRootRef}
              setIsMenuOpen={setIsMenuOpen}
              onClose={() => setIsMenuOpen(false)}
              tableCellNode={tableCellNode}
            />
          )}
        </>
      )}
    </div>
  );
}

export default function TableActionMenuPlugin(): ReactPortal {
  return createPortal(<TableCellActionMenuContainer />, document.body);
}
