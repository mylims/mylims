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
    throw new Error('No context was provided');
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
}

export function ToastNotificationCenter(props: ToastNotificationCenterProps) {
  const { deleteNotification, notifications } = useNotificationCenter();

  return (
    <div
      className={clsx(
        'fixed justify-center inset-x-0 flex pointer-events-none z-40',
        {
          'top-0': props.position === 'top',
          'bottom-0': props.position === 'bottom',
        },
        props.className,
      )}
    >
      <div className="w-full sm:w-96">
        <div
          className={clsx({
            'flex flex-col-reverse': props.position === 'bottom',
            'flex flex-col': props.position === 'top',
          })}
        >
          {notifications
            .filter((element): element is ToastNotificationState =>
              Boolean(element.isToast),
            )
            .map((notification) => {
              return (
                <div
                  key={notification.id}
                  className={
                    props.position === 'bottom' ? 'sm:mb-2' : 'sm:mt-2'
                  }
                >
                  <ToastNotification
                    {...notification}
                    position={props.position}
                    onDismiss={() => deleteNotification(notification.id)}
                  />
                </div>
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
}

export function NotificationCenter(props: NotificationCenterProps) {
  const { deleteNotification, notifications } = useNotificationCenter();

  return (
    <div
      className={clsx(
        'fixed flex pointer-events-none m-5 z-40',
        {
          'sm:items-start sm:justify-end items-end justify-center':
            props.position.endsWith('right'),
          'top-0': props.position.startsWith('top'),
          'bottom-0': props.position.startsWith('bottom'),
          'right-0': props.position.endsWith('right'),
          'left-0': props.position.endsWith('left'),
        },
        props.className,
      )}
    >
      <div className="w-full sm:w-96">
        <div
          className={clsx('flex justify-end', {
            'flex-col-reverse': props.position.startsWith('top'),
            'flex-col': props.position.startsWith('bottom'),
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
                  className="mb-5"
                  type={notification.type}
                  title={notification.title}
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
