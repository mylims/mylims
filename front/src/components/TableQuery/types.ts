import { ReactNode } from 'react';

export interface TableQueryContextType {
  columnsContext: {};
  dispatch(action: ReducerActions): void;
}
export interface TableQueryProps<T> {
  data: { list: Array<T>; totalCount: number } | undefined;
  pagination: unknown;
  loading?: boolean;
  onQueryChange(query: unknown): void;
  children: ReactNode;
}

export interface BaseColumnProps {
  fieldPath: string;
  disableSearch?: boolean;
  disableSort?: boolean;
  nullable?: boolean;
  index?: number;
}
export interface NumberColumnProps extends BaseColumnProps {
  format?: string;
}
export interface DateColumnProps extends BaseColumnProps {
  format?: string;
}

export interface TableQueryHook<T> {
  pagination: Record<'page' | 'skip' | 'limit', number>;
  query: T;
  setQuery(query: T): T;
}

export enum ColumnKind {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
}

export type ReducerActions =
  | { type: 'ADD_COLUMN'; payload: RowState }
  | { type: 'REMOVE_COLUMN'; payload: { index: number } };

type RemoveIndex<T> = Omit<Required<T>, 'index'>;
type RowState =
  | {
      index: number;
      kind: ColumnKind.TEXT;
      value: RemoveIndex<BaseColumnProps>;
    }
  | {
      index: number;
      kind: ColumnKind.NUMBER;
      value: RemoveIndex<NumberColumnProps>;
    }
  | {
      index: number;
      kind: ColumnKind.DATE;
      value: RemoveIndex<DateColumnProps>;
    };
export type TableState = RowState[];
