import { cloneDeep } from 'lodash';
import lightTheme from './light';
import { palette } from './palette';

const { secondary, dark } = palette;

const darkTheme = cloneDeep(lightTheme);

darkTheme.palette = {
  ...darkTheme.palette,
  secondary: [
    secondary[3], // 0 secondary
    dark[6], // 1 box-shadow, hover
  ],
  gray: [
    dark[7], // 0: Border
    dark[6], // 0: step bar, txstatus bg
  ],
  background: [
    dark[9], // 0: header, footer bg
    dark[9], // 1: main bg
    dark[8], // 2: content bg, hover
  ],
  text: [
    dark[1], // 0: Normal Text (normal)
    dark[0], // 1: Active (dark)
    dark[2], // 2: light text
    '#fff', // 3: white text
  ],
};

export default darkTheme;
