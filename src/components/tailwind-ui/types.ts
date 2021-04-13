export enum Color {
  primary = 'primary',
  neutral = 'neutral',
  success = 'success',
  warning = 'warning',
  danger = 'danger',
  alternative = 'alternative',
}

export enum Size {
  xSmall = 'xSmall',
  small = 'small',
  medium = 'medium',
  large = 'large',
  xLarge = 'xLarge',
}

export enum Variant {
  primary = 'primary',
  secondary = 'secondary',
  white = 'white',
}

export enum Roundness {
  light = 'light',
  full = 'full',
  circular = 'circular',
}

export type ActionType<Action, Payload = void> = Payload extends void
  ? { type: Action }
  : { type: Action; payload: Payload };

export type PropsOf<T = unknown> = T extends React.ElementType
  ? React.ComponentProps<T>
  : never;
