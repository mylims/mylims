import React, { ReactNode, useEffect } from 'react';

import { useTableQueryContext } from '../hooks/useTableQueryContext';
import { ColumnKind } from '../types';
import HeaderRender from './HeaderRender';

interface ActionsColumnProps {
  index?: number;
  children(row: Record<string, unknown>): ReactNode;
}
export default function ActionsColumn({ index, children }: ActionsColumnProps) {
  const { dispatch } = useTableQueryContext();

  useEffect(() => {
    if (index === undefined) {
      throw new Error('Index is not defined by the context for actions');
    }
    dispatch({
      type: 'ADD_COLUMN',
      payload: {
        index,
        value: { render: children, dataPath: ColumnKind.ACTIONS },
        kind: ColumnKind.ACTIONS,
      },
    });

    return () => dispatch({ type: 'REMOVE_COLUMN', payload: { index } });
  }, [index]);

  return <HeaderRender title="Actions" path="" />;
}
