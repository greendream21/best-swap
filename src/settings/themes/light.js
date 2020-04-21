import { lighten, darken } from 'polished';
import { palette } from './palette';

const { primary, secondary, dark } = palette;

const COL_DARKEN_RATE = 0.15;
const COL_LIGHTEN_RATE = 0.35;
const theme = {};

const DARK_COL = darken(COL_DARKEN_RATE, secondary[3]);
const LIGHT_COL = lighten(0.2, secondary[3]);

const DARK_COL_BASE = darken(COL_DARKEN_RATE, primary[2]);
const LIGHT_COL_BASE = lighten(0.2, primary[2]);

theme.palette = {
  gradient: [
    'linear-gradient(9.34deg, #50E3C2 19.28%, #33CCFF 106.03%)', // 0: Default
    `linear-gradient(9.34deg, ${DARK_COL_BASE} 19.28%, ${DARK_COL} 106.03%)`, // darken col
    `linear-gradient(9.34deg, ${LIGHT_COL_BASE} 19.28%, ${LIGHT_COL} 106.03%)`, // lighten col
  ],
  primary: [
    primary[2], // 0 primary
  ],
  secondary: [
    secondary[3], // 0 secondary
    secondary[0], // 1 box-shadow, hover
  ],
  warning: [
    '#F3BA2F', // 0: Warning
    darken(COL_DARKEN_RATE, '#F3BA2F'), // darken col
    lighten(COL_LIGHTEN_RATE, '#F3BA2F'), // lighten col
    'linear-gradient(47.73deg, #F3BA2F 0%, #F3BA2F 100%)', // gradient
  ],
  success: [
    primary[2], // 0: Success
    darken(COL_DARKEN_RATE, primary[2]), // darken col
    lighten(COL_LIGHTEN_RATE, primary[2]), // lighten col
    'linear-gradient(47.73deg, #50E3C2 0%, #50E3C2 100%)', // gradient
  ],
  error: [
    '#FF4954', // 0: Error
    darken(COL_DARKEN_RATE, '#FF4954'), // darken col
    lighten(COL_LIGHTEN_RATE, '#FF4954'), // lighten col
    'linear-gradient(47.73deg, #FF4954 0%, #FF4954 100%)', // gradient
  ],
  gray: [
    dark[1], // 0: Border
    dark[2], // 0: step bar, txstatus bg
  ],
  background: [
    '#fff', // 0: header, footer bg
    '#fff', // 1: main bg
    '#fafafa', // 2: content bg, hover
  ],
  text: [
    dark[7], // 0: Normal Text (normal)
    dark[9], // 1: Active (dark)
    dark[2], // 2: light text
    '#fff', // 3: white text
  ],
};

theme.sizes = {
  headerHeight: '70px',
  footerHeight: '50px',
  panelHeight: '550px',
  panelHeaderHeight: '50px',
  lineHeight: '50px',
  crypto: '35px',
  icon: '16px',
  social: '17px',
  gutter: {
    horizontal: '30px',
    vertical: '20px',
  },
  button: {
    small: {
      width: '55px',
      height: '20px',
    },
    normal: {
      width: '100px',
      height: '30px',
    },
    big: {
      width: '166px',
      height: '70px',
    },
  },
  tooltip: {
    small: '15px',
    normal: '30px',
  },
  font: {
    tiny: '8px',
    small: '10px',
    normal: '12px',
    big: '15px',
    large: '18px',
  },
  coin: {
    small: '30px',
    big: '40px',
  },
};

theme.fonts = {
  primary: 'Roboto, sans-serif',
  pre: 'Consolas, Liberation Mono, Menlo, Courier, monospace',
};

export default theme;
