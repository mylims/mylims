import { v4 as uuid } from '@lukeed/uuid';
import clsx from 'clsx';
import React, { ReactNode, useCallback, useContext, useReducer } from 'react';

import { Notification } from './Notification';
import {
  NotificationContext,
  NotificationActions,
  NotificationConfig,
} from './NotificationContext';
import { ToastNotification } from './ToastNotification';

export interface NotificationCenterProps {
  position: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
  className?: string;
}

export interface ToastNotificationCenterProps {
  position: 'top' | 'bottom';
  className?: string;
}

type ShowingOrRemoving = 'SHOWING' | 'REMOVING';

export interface NotificationState extends NotificationConfig {
  id: string;
  state: ShowingOrRemoving;
}

export interface NotificationToastState {
  id: string;
  state: ShowingOrRemoving;

  label: string;
  action?: {
    label: string;
    handle: () => void;
  };

  isToast: true;
}

interface NotificationsState {
  notifications: Array<NotificationState | NotificationToastState>;
}

function reducer(
  previous: NotificationsState,
  action: NotificationActions,
): NotificationsState {
  switch (action.type) {
    case 'ADD_NOTIFICATION': {
      const copy = previous.notifications.slice();
      copy.push({ ...action.payload });
      return { notifications: copy };
    }
    case 'DEL_NOTIFICATION': {
      const array = previous.notifications.filter(
        (element) => element.id !== action.payload,
      );
      return { notifications: array };
    }
    case 'DISAPPEAR': {
      const notifications = previous.notifications.map((element) => {
        if (element.id === action.payload) {
          return { ...element, state: 'REMOVING' as ShowingOrRemoving };
        }
        return element;
      });

      return { notifications };
    }
    default:
      throw new Error('NOPE');
  }
}

export function NotificationProvider(props: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, { notifications: [] });

  const dismiss = useCallback(
    function dismiss(payload: string) {
      dispatch({ type: 'DISAPPEAR', payload });
      setTimeout(() => {
        dispatch({ type: 'DEL_NOTIFICATION', payload });
      }, 200);
    },
    [dispatch],
  );

  const utils = {
    notifications: state.notifications,
    addNotification: useCallback(
      (notification, timeout) => {
        const id = uuid();

        if (timeout !== 0) {
          setTimeout(() => dismiss(id), timeout || 10000);
        }

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { ...notification, id, state: 'SHOWING' },
        });

        return id;
      },

      [dismiss, dispatch],
    ),
    addToastNotification: useCallback(
      (notification, timeout) => {
        const id = uuid();

        if (timeout !== 0) {
          setTimeout(() => dismiss(id), timeout || 10000);
        }

        dispatch({
          type: 'ADD_NOTIFICATION',
          payload: { ...notification, id, state: 'SHOWING', isToast: true },
        });

        return id;
      },
      [dismiss, dispatch],
    ),
    deleteNotification: dismiss,
  };

  return (
    <NotificationContext.Provider value={utils}>
      {props.children}
    </NotificationContext.Provider>
  );
}

export function useNotificationCenter() {
  const context = useContext(NotificationContext);

  if (context === null) {
    throw new Error('No context was provided');
  }

  return context;
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
            .filter(
              (element): element is NotificationToastState => !!element.isToast,
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

export function NotificationCenter(props: NotificationCenterProps) {
  const { deleteNotification, notifications } = useNotificationCenter();

  return (
    <div
      className={clsx(
        'fixed flex pointer-events-none m-5 z-40',
        {
          'sm:items-start sm:justify-end items-end justify-center': props.position.endsWith(
            'right',
          ),
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
