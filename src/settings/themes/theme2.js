import { cloneDeep } from 'lodash';
import defaultTheme from './themedefault';

const theme = cloneDeep(defaultTheme);
theme.palette.primary = ['#f00'];
theme.palette.secondary = ['#0f0'];

export default theme;
