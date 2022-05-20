import {
  createContext,
  CSSProperties,
  Dispatch,
  SetStateAction,
  useContext,
} from 'react';

export interface TooltipContext {
  contentRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  targetRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  arrowRef: Dispatch<SetStateAction<HTMLDivElement | null>>;
  delay: number;
  callbacks: {
    isTooltipOpen: boolean;
    openTooltip: () => void;
    closeTooltip: () => void;
  };
  popper: {
    attributes: {
      [key: string]:
        | {
            [key: string]: string;
          }
        | undefined;
    };
    styles: {
      [key: string]: CSSProperties;
    };
  };
}

export const tooltipContext = createContext<TooltipContext | null>(null);

export function useTooltipContext() {
  const ctx = useContext(tooltipContext);

  if (!ctx) {
    throw new Error("tooltip context isn't provided");
  }

  return ctx;
}
