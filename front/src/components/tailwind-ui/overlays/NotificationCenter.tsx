import { v4 as uuid } from '@lukeed/uuid';
import clsx from 'clsx';
import React, { ReactNode, useContext, useMemo, useReducer } from 'react';

import { Color } from '..';

import { Notification } from './Notification';
import {
  notificationContext,
  NotificationContext,
  notificationsReducer,
  NotificationState,
  ToastNotificationState,
} from './NotificationContext';
import { ToastNotification } from './ToastNotification';

export type {
  AddNotification,
  AddToastNotification,
  DeleteNotification,
  NotificationContext,
  NotificationConfig,
  ToastNotificationAction,
  ToastNotificationConfig,
} from './NotificationContext';

export function useNotificationCenter(): NotificationContext {
  const context = useContext(notificationContext);

  if (context === null) {
    throw new Error('Missing notification context');
  }

  return context;
}

type TimeoutConfig = Record<Color, number>;

export function NotificationProvider(props: {
  defaultTimeouts?: Partial<TimeoutConfig>;
  children: ReactNode;
}) {
  const {
    // Extract all properties so that we can useMemo() without requiring the
    // input object to be stable.
    defaultTimeouts: {
      primary = 7000,
      alternative = 7000,
      neutral = 7000,
      danger = 0,
      success = 3000,
      warning = 10000,
    } = {},
    children,
  } = props;

  const timeouts = useMemo(
    () => ({ primary, alternative, neutral, danger, success, warning }),
    [alternative, danger, neutral, primary, success, warning],
  );

  const [state, dispatch] = useReducer(notificationsReducer, {
    notifications: [],
  });

  const utils: Omit<NotificationContext, 'notifications'> = useMemo(() => {
    function dismiss(payload: string) {
      dispatch({ type: 'DISAPPEAR', payload });
      setTimeout(() => {
        dispatch({ type: 'DEL_NOTIFICATION', payload });
      }, 200);
    }

    return {
      addNotification(notification, timeout) {
        const id = uuid();
        const type = notification.type || Color.neutral;

        if (timeout === undefined) {
          timeout = timeouts[type];
        }

        if (timeout !== 0) {
          setTimeout(() => dismiss(id), timeout);
        }

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            ...notification,
            id,
            state: 'SHOWING',
            type,
            isToast: false,
          },
        });

        return id;
      },
      addToastNotification(notification, timeout = timeouts.neutral) {
        const id = uuid();

        if (timeout !== 0) {
          setTimeout(() => dismiss(id), timeout);
        }

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: {
            ...notification,
            id,
            state: 'SHOWING',
            isToast: true,
          },
        });

        return id;
      },
      deleteNotification: dismiss,
    };
  }, [timeouts]);

  return (
    <notificationContext.Provider
      value={{ ...utils, notifications: state.notifications }}
    >
      {children}
    </notificationContext.Provider>
  );
}

export interface ToastNotificationCenterProps {
  position: 'top' | 'bottom';
  className?: string;
  absolute?: boolean;
}

export function ToastNotificationCenter(props: ToastNotificationCenterProps) {
  const { deleteNotification, notifications } = useNotificationCenter();
  const isTop = props.position === 'top';

  return (
    <div
      className={clsx(
        'pointer-events-none inset-0 z-40 flex justify-center py-2',
        {
          'items-end': props.position === 'bottom',
        },
        props.absolute ? 'absolute' : 'fixed',
        props.className,
      )}
    >
      <div className="max-h-full w-full overflow-y-visible sm:w-96">
        <div
          className={clsx('flex gap-2', {
            'flex-col': isTop,
            'flex-col-reverse': !isTop,
          })}
        >
          {notifications
            .filter((element): element is ToastNotificationState =>
              Boolean(element.isToast),
            )
            .map((notification) => {
              return (
                <ToastNotification
                  {...notification}
                  isTop={isTop}
                  onDismiss={() => deleteNotification(notification.id)}
                  key={notification.group || notification.id}
                />
              );
            })}
        </div>
      </div>
    </div>
  );
}

export interface NotificationCenterProps {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
  absolute?: boolean;
}

export function NotificationCenter(props: NotificationCenterProps) {
  const { deleteNotification, notifications } = useNotificationCenter();
  const isTop = props.position.startsWith('top');
  const isLeft = props.position.endsWith('left');

  return (
    <div
      className={clsx(
        'pointer-events-none inset-0 z-40 flex items-center justify-end p-5',
        {
          'sm:items-start': isTop,
          'sm:items-end': !isTop,
          'sm:justify-start': isLeft,
          'sm:justify-end': !isLeft,
        },
        props.absolute ? 'absolute' : 'fixed',
        props.className,
      )}
    >
      <div className="max-h-full w-full overflow-y-visible sm:w-96">
        <div
          className={clsx('flex justify-end gap-5', {
            'flex-col': isTop,
            'flex-col-reverse': !isTop,
          })}
        >
          {notifications
            .filter((element): element is NotificationState => !element.isToast)
            .map((notification) => {
              return (
                <Notification
                  key={notification.id}
                  {...notification}
                  onDismiss={() => deleteNotification(notification.id)}
                  type={notification.type}
                  title={notification.title}
                  isTop={isTop}
                >
                  {notification.content}
                </Notification>
              );
            })}
        </div>
      </div>
    </div>
  );
}
