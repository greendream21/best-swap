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
    size: key('sizes.font.large', '18px'),
    spacing: '2.5px',
  },
};

const sizes = {
  small: {
    width: key('sizes.button.small.width', '55px'),
    height: key('sizes.button.small.height', '20px'),
    borderBottom: '2px',
  },
  normal: {
    width: key('sizes.button.normal.width', '100px'),
    height: key('sizes.button.normal.height', '30px'),
    borderBottom: '3px',
  },
  big: {
    width: key('sizes.button.big.width', '300px'),
    height: key('sizes.button.big.height', '70px'),
    borderBottom: '4px',
  },
};

const colorGroups = {
  primary: {
    main: palette('primary', 0),
    darken: palette('secondary', 0),
    lighten: palette('secondary', 1),
    text: palette('primary', 1),
    borderBottom: palette('primary', 0),
  },
  success: {
    main: palette('success', 0),
    darken: palette('success', 1),
    lighten: palette('success', 2),
    text: palette('success', 0),
    borderBottom: palette('success', 3),
  },
  warning: {
    main: palette('warning', 0),
    darken: palette('warning', 1),
    lighten: palette('warning', 2),
    text: palette('warning', 0),
    borderBottom: palette('warning', 3),
  },
  error: {
    main: palette('error', 0),
    darken: palette('error', 1),
    lighten: palette('error', 2),
    text: palette('error', 0),
    borderBottom: palette('error', 3),
  },
};

const getBtnThemeColor = () => {
  const theme = {};

  Object.keys(colorGroups).forEach(colorType => {
    const value = {};
    const { main, lighten, darken, text, borderBottom } = colorGroups[
      colorType
    ];

    value.default = {
      text: '#fff',
      border: text,
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
        border: text,
        background: main,
      },
      focus: {
        border: text,
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
    value.normal = {
      text: palette('text', 0),
      border: palette('border', 0),
      background: '#fff',
      action: {
        text: palette('text', 0),
        border: palette('border', 0),
        background: '#fff',
      },
      focus: {
        border: palette('border', 0),
        borderBottom,
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

    border-radius: ${props =>
      props.round ? sizes[props.sizevalue].height : '3px'};
    min-width: ${props => sizes[props.sizevalue].width};
    height: ${props => sizes[props.sizevalue].height};
    font-size: ${props => fontSettings[props.sizevalue].size};
    font-weight: ${props => props.weight};
    letter-spacing: ${props => fontSettings[props.sizevalue].spacing};

    text-transform: uppercase;

    /* set theme colors away from antd defaults */
    &,
    &:active,
    &:focus {
      color: ${props => colors[props.color][props.typevalue].text};
      border-color: ${props => colors[props.color][props.typevalue].border};
      background: ${props => colors[props.color][props.typevalue].background};
      ${props =>
        props.typevalue === 'normal' &&
        `
          background-position: 0 100%;
          background-repeat: no-repeat;
          -webkit-background-size: 100% 3px;
          -moz-background-size: 100% 3px;
          background-size: 100% 3px;
        `}
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
        background: ${props =>
          props.typevalue === 'normal'
            ? colors[props.color][props.typevalue].focus.borderBottom
            : colors[props.color][props.typevalue].action.background};
        ${props =>
          props.typevalue === 'normal' &&
          `
          background-position: 0 100%;
          background-repeat: no-repeat;
          -webkit-background-size: 100% 3px;
          -moz-background-size: 100% 3px;
          background-size: 100% 3px;
        `}
      }
    }

    i {
      display: flex;
      font-size: 18px;
    }
  }
`;
