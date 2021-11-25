import { ApolloError } from '@apollo/client';
import { ReactNode } from 'react';

export interface QueryType {
  page: string;
  sortField: string;
  sortDirection: string;
  [key: string]: string | null;
}
export interface TableQueryContextType {
  query: QueryType;
  setQuery(this: void, query: QueryType): void;
  submitQuery(this: void, query: QueryType): void;
  dispatch(this: void, action: ReducerActions): void;
}
export interface TableQueryProps<T> {
  data: { list: Array<T>; totalCount: number } | undefined;
  loading?: boolean;
  error?: ApolloError;
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
  children?: (row: Record<string, unknown>) => ReactNode;
}
export interface NumberColumnProps extends BaseColumnProps {
  format?: string;
}
export interface DateColumnProps extends BaseColumnProps {
  format?: string;
}
export type SelectionValue = Record<'value' | 'label', string>;
export interface SelectColumnProps extends BaseColumnProps {
  options: SelectionValue[] | string[];
}
interface ActionsColumnProps {
  index?: number;
  render(row: Record<string, unknown>): ReactNode;
  dataPath: string;
}

export interface TableQueryHook {
  query: QueryType;
  setQuery(this: void, query: QueryType): void;
}

export enum ColumnKind {
  TEXT = 'text',
  NUMBER = 'number',
  DATE = 'date',
  MULTI_SELECT = 'multiSelect',
  ACTIONS = 'actions',
}

export type ReducerActions =
  | { type: 'ADD_COLUMN'; payload: RowState }
  | { type: 'REMOVE_COLUMN'; payload: { dataPath: string } };

interface RowStateGeneric<K, V> {
  index: number;
  kind: K;
  value: Omit<Required<V>, 'index' | 'title' | 'children'> & {
    render: ActionsColumnProps['render'];
  };
}
export type RowState =
  | RowStateGeneric<ColumnKind.TEXT, BaseColumnProps>
  | RowStateGeneric<ColumnKind.NUMBER, BaseColumnProps>
  | RowStateGeneric<ColumnKind.DATE, BaseColumnProps>
  | RowStateGeneric<ColumnKind.MULTI_SELECT, BaseColumnProps>
  | {
      index: number;
      kind: ColumnKind.ACTIONS;
      value: Omit<ActionsColumnProps, 'index'>;
    };
export type TableState = RowState[];
