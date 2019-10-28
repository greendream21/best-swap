import { lighten, darken } from 'polished';

const COL_DARKEN_RATE = 0.15;
const COL_LIGHTEN_RATE = 0.35;
const theme = {};

const DARK_COL = darken(COL_DARKEN_RATE, '#33CCFF');
const LIGHT_COL = lighten(0.2, '#33CCFF');

const DARK_COL_BASE = darken(COL_DARKEN_RATE, '#50E3C2');
const LIGHT_COL_BASE = lighten(0.2, '#50E3C2');

theme.palette = {
  primary: [
    'linear-gradient(9.34deg, #50E3C2 19.28%, #33CCFF 106.03%)', // 0: Default
    '#50E3C2', // 1:
    '#F0B90B', // 2:
    'rgba(63, 163, 246, 0.2)', // 3: Selected Background
    'linear-gradient(47.73deg, #50E3C2 0%, #33CCFF 100%)', // 4: Gradient
    '#ECEEEF', // 5: border col
    '#33CCFF',
  ],
  background: [
    '#fff', // 0: header, footer bg
    '#fff', // 1: main bg
    '#F8F9FA', // 2: content bg
    'rgba(63, 163, 246, 0.2)', // 3: selected bg
    '#50E3C2', // 4: green button bg
    '#33CCFF', // 5: lock bg
    '#ECEEEF', // 6: drag, border bg
    'linear-gradient(47.73deg, #50E3C2 0%, #33CCFF 100%)', // 7: gradient bg
    '#D3DBE7', // 8: gray background
  ],
  secondary: [
    `linear-gradient(9.34deg, ${DARK_COL_BASE} 19.28%, ${DARK_COL} 106.03%)`, // darken col
    `linear-gradient(9.34deg, ${LIGHT_COL_BASE} 19.28%, ${LIGHT_COL} 106.03%)`, // lighten col
    'linear-gradient(9.34deg, #50E3C2 19.28%, #33CCFF 106.03%)', // lighten col
  ],
  border: [
    '#E2EBF0', // 0: Border
    '#33CCFF', // 1: BorderBlue
  ],
  warning: [
    '#F3BA2F', // 0: Warning
    darken(COL_DARKEN_RATE, '#F3BA2F'), // darken col
    lighten(COL_LIGHTEN_RATE, '#F3BA2F'), // lighten col
    'linear-gradient(47.73deg, #F3BA2F 0%, #F3BA2F 100%)', // gradient
  ],
  success: [
    '#50E3C2', // 0: Success
    darken(COL_DARKEN_RATE, '#50E3C2'), // darken col
    lighten(COL_LIGHTEN_RATE, '#50E3C2'), // lighten col
    'linear-gradient(47.73deg, #50E3C2 0%, #50E3C2 100%)', // gradient
  ],
  error: [
    '#FF4954', // 0: Error
    darken(COL_DARKEN_RATE, '#FF4954'), // darken col
    lighten(COL_LIGHTEN_RATE, '#FF4954'), // lighten col
    'linear-gradient(47.73deg, #FF4954 0%, #FF4954 100%)', // gradient
  ],
  grayscale: [
    '#bababa', // 0: GreyShade
    '#c1c1c1', // 1: GreyDark
    '#D8D8D8', // 2: Grey
    '#f1f1f1', // 3: GreyAlt
    '#F3F3F3', // 4: GreyLight
    '#fafafa', // 5: DarkWhite
    '#F9F9F9', // 6: DarkerWhite
    '#fcfcfc', // 7: #fff Darken 1%
  ],
  text: [
    '#323C47', // 0: Normal Text (normal)
    '#848E9C', // 1: Heading
    '#1C2731', // 2: Active (dark)
    '#AAB5C4', // 3: Text Color (light)
    '#B7BBBD', // 4: Darker Text (gray)
    '#9B9B9B', // 5: Input Text (input)
    '#919D9D', // 6: Footer Color
    '#50E3C2', // 7
    '#626D7C', // 8
  ],
  color: [
    '#FEAC01', // 0: Orange
    '#42299a', // 1: Purple
    '#F75D81', // 2: Pink
    '#7ED321', // 3: LimeGreen
    '#39435f', // 4: BlueShade
    '#FFCA28', // 5: Yellow
    '#F2BD1B', // 6: Yellow Darken 5%
    '#3b5998', // 7: Facebook
    '#344e86', // 8: Facebook Darken 5%
    '#dd4b39', // 9: Google Plus
    '#d73925', // 10: Google Plus Darken 5%
    '#e14615', // 11: Auth0
    '#ca3f13', // 12: Auth0
    '#e0364c', // 13: themeColor--AlizarinCrimson
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
