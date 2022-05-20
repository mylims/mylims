import { ReactNode } from 'react';
import { createPortal } from 'react-dom';

export interface PortalProps {
  children: ReactNode;
}

export function Portal(props: PortalProps) {
  return createPortal(props.children, document.body);
}
