import React from 'react';

import { Popover as AntPopover } from 'antd';
import { PopoverProps as Props } from 'antd/lib/popover';

import { getAppContainer } from 'helpers/elementHelper';

import { TooltipContent, PopoverIcon } from './Popover.style';

export interface PopoverProps extends Partial<Props> {
  tooltip: React.ReactNode
  children: React.ReactElement
}

export const Popover = ({
  placement = 'bottom',
  tooltip,
  children,
}: PopoverProps) => {
  return (
    <AntPopover
      content={<TooltipContent>{tooltip}</TooltipContent>}
      getPopupContainer={getAppContainer}
      placement={placement}
      overlayStyle={{
        animationDuration: '0s !important',
        animation: 'none !important',
        background: 'transparent',
      }}
      mouseEnterDelay={0.01}
    >
      {children}
    </AntPopover>
  );
};

export interface PopoverIconProps extends Partial<PopoverProps> {
  tooltip: React.ReactNode
  color?: string
}

export const TooltipIcon = ({
  placement = 'bottom',
  tooltip,
  color = 'primary',
}: PopoverIconProps) => {
  return (
    <Popover tooltip={tooltip} placement={placement}>
      <PopoverIcon color={color} />
    </Popover>
  );
};
