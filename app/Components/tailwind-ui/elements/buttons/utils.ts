import { Size, Color, Variant } from '../../types';

const sizes: Record<Size, string> = {
  [Size.xSmall]: 'px-2.5 py-1.5 text-xs',
  [Size.small]: 'px-3 py-2 text-sm',
  [Size.medium]: 'px-4 py-2 text-sm',
  [Size.large]: 'px-4 py-2 text-base',
  [Size.xLarge]: 'px-6 py-3 text-base',
};

const colorsPrimary: Record<Color, string> = {
  [Color.primary]:
    'border border-transparent bg-primary-600 disabled:bg-primary-400 hover:bg-primary-700 focus:ring-primary-500 active:bg-primary-800',
  [Color.neutral]:
    'border border-transparent bg-neutral-600 disabled:bg-neutral-400 hover:bg-neutral-700 focus:ring-neutral-500 active:bg-neutral-800',
  [Color.success]:
    'border border-transparent bg-success-600 disabled:bg-success-400 hover:bg-success-700 focus:ring-success-500 active:bg-success-800',
  [Color.warning]:
    'border border-transparent bg-warning-600 disabled:bg-warning-400 hover:bg-warning-700 focus:ring-warning-500 active:bg-warning-800',
  [Color.danger]:
    'border border-transparent bg-danger-600 disabled:bg-danger-400 hover:bg-danger-700 focus:ring-danger-500 active:bg-danger-800',
  [Color.alternative]:
    'border border-transparent bg-alternative-600 disabled:bg-alternative-400 hover:bg-alternative-700 focus:ring-alternative-500 active:bg-alternative-800',
};

const colorsSecondary: Record<Color, string> = {
  [Color.primary]:
    'border border-transparent text-primary-700 disabled:text-primary-400 bg-primary-100 disabled:bg-primary-50 hover:bg-primary-200 focus:ring-primary-500 active:bg-primary-300',
  [Color.neutral]:
    'border border-transparent text-neutral-700 disabled:text-neutral-400 bg-neutral-100 disabled:bg-neutral-50 hover:bg-neutral-200 focus:ring-neutral-500 active:bg-neutral-300',
  [Color.success]:
    'border border-transparent text-success-700 disabled:text-success-400 bg-success-100 disabled:bg-success-50 hover:bg-success-200 focus:ring-success-500 active:bg-success-300',
  [Color.warning]:
    'border border-transparent text-warning-700 disabled:text-warning-400 bg-warning-100 disabled:bg-warning-50 hover:bg-warning-200 focus:ring-warning-500 active:bg-warning-300',
  [Color.danger]:
    'border border-transparent text-danger-700 disabled:text-danger-400 bg-danger-100 disabled:bg-danger-50 hover:bg-danger-200 focus:ring-danger-500 active:bg-danger-300',
  [Color.alternative]:
    'border border-transparent text-alternative-700 disabled:text-alternative-400 bg-alternative-100 disabled:bg-alternative-50 hover:bg-alternative-200 focus:ring-alternative-500 active:bg-alternative-300',
};

const colorsWhite: Record<Color, string> = {
  [Color.primary]:
    'border border-neutral-300 text-neutral-700 disabled:text-neutral-400 bg-white disabled:bg-white hover:bg-neutral-50 focus:ring-primary-500 active:bg-neutral-100',
  [Color.neutral]:
    'border border-neutral-300 text-neutral-700 disabled:text-neutral-400 bg-white disabled:bg-white hover:bg-neutral-50 focus:ring-primary-500 active:bg-neutral-100',
  [Color.success]:
    'border border-neutral-300 text-neutral-700 disabled:text-neutral-400 bg-white disabled:bg-white hover:bg-neutral-50 focus:ring-primary-500 active:bg-neutral-100',
  [Color.warning]:
    'border border-neutral-300 text-neutral-700 disabled:text-neutral-400 bg-white disabled:bg-white hover:bg-neutral-50 focus:ring-primary-500 active:bg-neutral-100',
  [Color.danger]:
    'border border-neutral-300 text-neutral-700 disabled:text-neutral-400 bg-white disabled:bg-white hover:bg-neutral-50 focus:ring-primary-500 active:bg-neutral-100',
  [Color.alternative]:
    'border border-neutral-300 text-neutral-700 disabled:text-neutral-400 bg-white disabled:bg-white hover:bg-neutral-50 focus:ring-primary-500 active:bg-neutral-100',
};

function getVariantColor(variant: Variant, color: Color): string {
  switch (variant) {
    case Variant.primary:
      return colorsPrimary[color];
    case Variant.secondary:
      return colorsSecondary[color];
    case Variant.white:
      return colorsWhite[color];
    default:
      throw new Error('Variant cannot be null');
  }
}

export { sizes, getVariantColor, colorsPrimary, colorsSecondary, colorsWhite };
