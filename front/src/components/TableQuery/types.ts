import { ReactNode } from 'react';

export interface QueryType {
  page: string;
  sortField: string;
  sortDirection: string;
  [key: string]: string | null;
}
export interface TableQueryContextType {
  query: QueryType;
  setQuery(query: QueryType): void;
  submitQuery(query: QueryType): void;
  dispatch(action: ReducerActions): void;
}
export interface TableQueryProps<T> {
  data: { list: Array<T>; totalCount: number } | undefined;
  loading?: boolean;
  itemsPerPage?: number;
  query: QueryType;
  onQueryChange(query: QueryType): void;
  children: ReactNode;
}

export interface BaseColumnProps {
  title: string;
  dataPath: string;
  queryPath?: string;
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
interface ActionsColumnProps {
  index?: number;
  render(row: Record<string, unknown>): ReactNode;
  dataPath: string;
}

export interface TableQueryHook {
  pagination: Record<'page' | 'skip' | 'limit', number>;
  query: Record<string, string>;
  setQuery(query: Record<string, string>): void;
}

export enum ColumnKind {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  ACTIONS = 'actions',
}

export type ReducerActions =
  | { type: 'ADD_COLUMN'; payload: RowState }
  | { type: 'REMOVE_COLUMN'; payload: { index: number } };

type RowStateGeneric<K, V> = {
  index: number;
  kind: K;
  value: Omit<Required<V>, 'index' | 'title'>;
};
export type RowState =
  | RowStateGeneric<ColumnKind.TEXT, BaseColumnProps>
  | RowStateGeneric<ColumnKind.NUMBER, NumberColumnProps>
  | RowStateGeneric<ColumnKind.DATE, DateColumnProps>
  | RowStateGeneric<ColumnKind.ACTIONS, ActionsColumnProps>;
export type TableState = RowState[];
