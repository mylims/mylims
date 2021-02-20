import { createContext, ReactNode } from 'react';

import { ActionType } from '../types';

import {
  NotificationState,
  NotificationToastState,
} from './NotificationCenter';

export interface NotificationConfig {
  title?: string;
  content: ReactNode;
  icon?: ReactNode;

  isToast?: false;
}

export interface NotificationContextHook {
  notifications: Array<NotificationState | NotificationToastState>;
  addNotification: (
    notification: Omit<NotificationConfig, 'isToast'>,
    timeout?: number,
  ) => string;
  addToastNotification: (
    notification: Omit<NotificationToastState, 'id' | 'state' | 'isToast'>,
    timeout?: number,
  ) => string;
  deleteNotification: (id: string) => void;
}

export type NotificationActions =
  | ActionType<'ADD_NOTIFICATION', NotificationState | NotificationToastState>
  | ActionType<'DEL_NOTIFICATION', string>
  | ActionType<'DISAPPEAR', string>;

export const NotificationContext = createContext<NotificationContextHook | null>(
  null,
);
