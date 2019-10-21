import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import { Button } from 'antd';
import { transition } from '../../../settings/style-util';

const fontSettings = {
  small: {
    size: key('sizes.font.small', '10px'),
    spacing: '0.5px',
  },
  normal: {
    size: key('sizes.font.normal', '11px'),
    spacing: '2.5px',
  },
  big: {
    size: key('sizes.font.normal', '11px'),
    spacing: '2.5px',
  },
};

const sizes = {
  small: {
    width: key('sizes.button.small.width', '55px'),
    height: key('sizes.button.small.height', '20px'),
  },
  normal: {
    width: key('sizes.button.normal.width', '100px'),
    height: key('sizes.button.normal.height', '30px'),
  },
  big: {
    width: key('sizes.button.big.width', '300px'),
    height: key('sizes.button.big.height', '50px'),
  },
};

const colorGroups = {
  primary: {
    main: palette('primary', 0),
    darken: palette('secondary', 0),
    lighten: palette('secondary', 1),
    text: palette('primary', 1),
  },
  success: {
    main: palette('success', 0),
    darken: palette('success', 1),
    lighten: palette('success', 2),
    text: palette('success', 0),
  },
  warning: {
    main: palette('warning', 0),
    darken: palette('warning', 1),
    lighten: palette('warning', 2),
    text: palette('warning', 0),
  },
  error: {
    main: palette('error', 0),
    darken: palette('error', 1),
    lighten: palette('error', 2),
    text: palette('error', 0),
  },
};

const getBtnThemeColor = () => {
  const theme = {};

  Object.keys(colorGroups).forEach(colorType => {
    const value = {};
    const { main, lighten, darken, text } = colorGroups[colorType];

    value.default = {
      text: '#fff',
      border: main,
      background: main,
      action: {
        text: '#fff',
        border: darken,
        background: darken,
      },
      focus: {
        border: darken,
      },
    };

    value.outline = {
      text,
      border: text,
      background: '#fff',
      action: {
        text: '#fff',
        border: main,
        background: main,
      },
      focus: {
        border: main,
      },
    };
    value.ghost = {
      text: palette('text', 3),
      border: palette('primary', 5),
      background: '#fff',
      action: {
        text: main,
        border: main,
        background: lighten,
      },
      focus: {
        border: main,
      },
    };

    theme[colorType] = value;
  });

  return theme;
};

const colors = getBtnThemeColor();

export const ButtonWrapper = styled(Button)`
  &.ant-btn {
    display: flex;
    justify-content: space-around;
    align-items: center;

    min-width: ${props => sizes[props.sizevalue].width};
    height: ${props => sizes[props.sizevalue].height};
    font-size: ${props => fontSettings[props.sizevalue].size};
    font-weight: ${props => props.weight};
    letter-spacing: ${props => fontSettings[props.sizevalue].spacing};

    text-transform: uppercase;
    ${transition()}

    /* set theme colors away from antd defaults */
    &,
    &:active,
    &:focus {
      color: ${props => colors[props.color][props.typevalue].text};
      border-color: ${props => colors[props.color][props.typevalue].border};
      border-image: ${props => colors[props.color][props.typevalue].border};
      background: ${props => colors[props.color][props.typevalue].background};
    }

    /* provide focus styles over the underlying styles */
    &:focus,
    &:active {
      border-color: ${props =>
        colors[props.color][props.typevalue].focus
          .border} !important; /* HACK: Border is overridden in selection.style.js buttons we need to create a new style for these buttons remove this when ready */
    }

    /* apply special override styles for .focused class */
    &.focused,
    &:hover {
      &,
      &:focus,
      &:active {
        color: ${props => colors[props.color][props.typevalue].action.text};
        border-color: ${props =>
          colors[props.color][props.typevalue].action.border};
        border-color: ${props =>
          colors[props.color][props.typevalue].action.border};
        background: ${props =>
          colors[props.color][props.typevalue].action.background};
      }
    }

    i {
      display: flex;
      font-size: 16px;
    }
  }
`;
