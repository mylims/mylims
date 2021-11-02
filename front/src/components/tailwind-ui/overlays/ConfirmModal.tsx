import React, { ElementType, ReactNode } from 'react';

import { Button, Color, Variant } from '..';

import { Modal, ModalProps } from './Modal';

export type ConfirmModalProps = Omit<
  ModalProps<ElementType>,
  'children' | 'wrapperComponent' | 'wrapperProps' | 'iconColor'
> & {
  color?: Color;
  title: ReactNode;
  body?: ReactNode;
  confirmText: string;
  onConfirm?: () => void;
  renderConfirm?: (options: ConfirmModalConfirmOptions) => ReactNode;
  cancelText?: string;
  onCancel?: () => void;
  renderCancel?: (options: ConfirmModalCancelOptions) => ReactNode;
};

export interface ConfirmModalConfirmOptions {
  confirmText: string;
  onConfirm?: () => void;
  color: Color;
}

export interface ConfirmModalCancelOptions {
  cancelText: string;
  onCancel?: () => void;
}

function defaultRenderConfirm(options: ConfirmModalConfirmOptions) {
  return (
    <Button
      variant={Variant.primary}
      color={options.color}
      onClick={options.onConfirm}
    >
      {options.confirmText}
    </Button>
  );
}

function defaultRenderCancel(options: ConfirmModalCancelOptions) {
  return (
    <Button variant={Variant.white} onClick={options.onCancel}>
      {options.cancelText}
    </Button>
  );
}

export function ConfirmModal(props: ConfirmModalProps) {
  const {
    color = Color.primary,
    title,
    body,
    confirmText,
    onConfirm,
    renderConfirm = defaultRenderConfirm,
    cancelText = 'Cancel',
    onCancel,
    renderCancel = defaultRenderCancel,
    onRequestClose = onCancel,
    ...modalProps
  } = props;
  return (
    <Modal iconColor={color} onRequestClose={onRequestClose} {...modalProps}>
      <Modal.Header>{title}</Modal.Header>
      <Modal.Body>
        <Modal.Description>{body}</Modal.Description>
      </Modal.Body>
      <Modal.Footer>
        {renderCancel({ cancelText, onCancel })}
        {renderConfirm({ confirmText, onConfirm, color })}
      </Modal.Footer>
    </Modal>
  );
}
