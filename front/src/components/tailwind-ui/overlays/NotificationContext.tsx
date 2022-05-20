import { createContext, ReactNode } from 'react';

import { Color } from '..';
import { ActionType } from '../types';

export interface NotificationConfig {
  title: string;
  content?: ReactNode;
  icon?: ReactNode;
  type?: Color;
}

export interface ToastNotificationAction {
  label: string;
  handle: () => void;
}

export interface ToastNotificationConfig {
  label: string;
  action?: ToastNotificationAction;
  group?: string;
}

export type AddNotification = (
  notification: NotificationConfig,
  timeout?: number,
) => string;

export type AddToastNotification = (
  notification: ToastNotificationConfig,
  timeout?: number,
) => string;

export type DeleteNotification = (id: string) => void;

export interface NotificationContext {
  notifications: Array<NotificationState | ToastNotificationState>;
  addNotification: AddNotification;
  addToastNotification: AddToastNotification;
  deleteNotification: DeleteNotification;
}

export type NotificationActions =
  | ActionType<'ADD_NOTIFICATION', NotificationState | ToastNotificationState>
  | ActionType<'DEL_NOTIFICATION', string>
  | ActionType<'DISAPPEAR', string>;

export const notificationContext = createContext<NotificationContext | null>(
  null,
);

interface NotificationsState {
  notifications: Array<NotificationState | ToastNotificationState>;
}

type ShowingOrRemoving = 'SHOWING' | 'REMOVING';

export interface NotificationState extends NotificationConfig {
  id: string;
  state: ShowingOrRemoving;
  type: Color;
  isToast: false;
}

export interface ToastNotificationState extends ToastNotificationConfig {
  id: string;
  state: ShowingOrRemoving;
  isToast: true;
}

export function notificationsReducer(
  previous: NotificationsState,
  action: NotificationActions,
): NotificationsState {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      let copy = previous.notifications.slice();

      if (!action.payload.isToast) {
        copy.push({ ...action.payload, type: action.payload.type });
      } else {
        if (action.payload.group) {
          const group = action.payload.group;
          copy = copy.filter((el) => el.isToast && el.group !== group);
        }

        copy.push({ ...action.payload });
      }

      return { notifications: copy };
    }
    case 'DEL_NOTIFICATION': {
      const array = previous.notifications.filter(
        (element) => element.id !== action.payload,
      );
      return { notifications: array };
    }
    case 'DISAPPEAR': {
      const notifications = previous.notifications.map(
        (element): NotificationState | ToastNotificationState => {
          if (element.id === action.payload) {
            return { ...element, state: 'REMOVING' };
          }
          return element;
        },
      );

      return { notifications };
    }
    default:
      throw new Error('unreachable');
  }
}
