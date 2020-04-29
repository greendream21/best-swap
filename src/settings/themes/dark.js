import { cloneDeep } from 'lodash';
import lightTheme from './light';
import { palette, BIFROST_BLUE } from './palette';

const { dark } = palette;

const darkTheme = cloneDeep(lightTheme);

darkTheme.palette = {
  ...darkTheme.palette,
  secondary: [
    BIFROST_BLUE, // 0 secondary
    dark[6], // 1 box-shadow, hover
  ],
  gray: [
    dark[8], // 0: Border
    dark[6], // 1: step bar, txstatus bg
    dark[5], // 2: hover
  ],
  background: [
    dark[9], // 0: header, footer bg
    dark[9], // 1: main bg
    dark[8], // 2: hover
    '#000', // 3: content bg
    dark[8], // 4: popover bg
  ],
  text: [
    '#fff', // 0: Normal Text (normal)
    dark[0], // 1: Active (dark)
    dark[1], // 2: light text
    '#fff', // 3: white text
  ],
};

export default darkTheme;
