import React, { ReactNode, useEffect } from 'react';

import HeaderRender from '../components/HeaderRender';
import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { ColumnKind } from '../types';

interface ActionsColumnProps {
  index?: number;
  width?: number;
  children(row: Record<string, unknown>): ReactNode;
}
export default function ActionsColumn({
  index,
  width,
  children,
}: ActionsColumnProps) {
  const { dispatch } = useTableQueryContext();

  useEffect(() => {
    if (index === undefined) {
      throw new Error('Index is not defined by the context for actions');
    }
    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        index,
        width,
        value: { render: children, dataPath: ColumnKind.ACTIONS },
        kind: ColumnKind.ACTIONS,
        title: ColumnKind.ACTIONS,
      },
    });

    return () =>
      dispatch({
        type: 'REMOVE_COLUMN',
        payload: { title: ColumnKind.ACTIONS },
      });
  }, [index, width, children, dispatch]);

  return <HeaderRender title="Actions" path="" width={width} disableSort />;
}
