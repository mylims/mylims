import React, { ReactNode } from 'react';

import { Tooltip, TooltipProps } from './Tooltip';

export interface WithTooltipProps {
  tooltip?: ReactNode;
  tooltipPlacement?: TooltipProps['placement'];
  tooltipDelay?: TooltipProps['delay'];
}

export function WithTooltip(props: WithTooltipProps & { children: ReactNode }) {
  const { children, tooltip, tooltipDelay, tooltipPlacement } = props;

  if (tooltip) {
    return (
      <Tooltip placement={tooltipPlacement} delay={tooltipDelay}>
        <Tooltip.Content>{tooltip}</Tooltip.Content>
        <Tooltip.Target>{children}</Tooltip.Target>
      </Tooltip>
    );
  }

  return <>{children}</>;
}
