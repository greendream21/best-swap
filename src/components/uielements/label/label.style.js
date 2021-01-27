import styled from 'styled-components';
import { palette } from 'styled-theme';

const fontSettings = {
  tiny: {
    size: '10px',
    spacing: '0.36px',
  },
  small: {
    size: '12px',
    spacing: '0.42px',
  },
  normal: {
    size: '14px',
    spacing: '1px',
  },
  big: {
    size: '16px',
    spacing: '1px',
  },
  large: {
    size: '20px',
    spacing: '1px',
  },
};

const colors = {
  gradient: palette('gradient', 0),
  primary: palette('primary', 0),
  success: palette('success', 0),
  warning: palette('warning', 0),
  error: palette('error', 0),
  normal: palette('text', 0),
  light: palette('text', 2),
  dark: palette('text', 1),
  gray: palette('text', 2),
  input: palette('text', 2),
  white: '#fff',
};

export const LabelWrapper = styled.div`
  padding: 10px 0;
  font-size: ${props => fontSettings[props.size].size};
  font-weight: ${props => props.weight};
  letter-spacing: ${props => fontSettings[props.size].spacing};
  color: ${props => colors[props.color]};
  cursor: ${props => props.onClick && 'pointer'};
`;
