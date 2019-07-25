import styled from 'styled-components';
import { palette, key } from 'styled-theme';
import { Button } from 'antd';

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
  },
  success: {
    main: palette('success', 0),
    darken: palette('success', 1),
    lighten: palette('success', 2),
  },
  warning: {
    main: palette('warning', 0),
    darken: palette('warning', 1),
    lighten: palette('warning', 2),
  },
  error: {
    main: palette('error', 0),
    darken: palette('error', 1),
    lighten: palette('error', 2),
  },
};

const getBtnThemeColor = () => {
  const theme = {};

  Object.keys(colorGroups).forEach(colorType => {
    const value = {};
    const { main, lighten, darken } = colorGroups[colorType];

    value.default = {
      text: '#fff',
      border: main,
      background: main,
      action: {
        text: '#fff',
        border: darken,
        background: darken,
      },
    };
    value.outline = {
      text: main,
      border: main,
      background: '#fff',
      action: {
        text: '#fff',
        border: main,
        background: main,
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
    color: ${props => colors[props.color][props.typevalue].text};
    border-color: ${props => colors[props.color][props.typevalue].border};
    background-color: ${props =>
      colors[props.color][props.typevalue].background};
    text-transform: uppercase;

    &:hover,
    &:focus {
      color: ${props => colors[props.color][props.typevalue].action.text};
      border-color: ${props =>
        colors[props.color][props.typevalue].action.border};
      background-color: ${props =>
        colors[props.color][props.typevalue].action.background};
    }

    i {
      display: flex;
      font-size: 16px;
    }
  }
`;
