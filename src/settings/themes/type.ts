export type Palette = {
  primary: string[];
  secondary: string[];
  gray: string[];
  dark: string[];
};

type ThemePalette = {
  gradient: string[];
  primary: string[];
  secondary: string[];
  warning: string[];
  success: string[];
  error: string[];
  gray: string[];
  background: string[];
  text: string[];
};

type ThemeSize = {
  headerHeight: string;
  footerHeight: string;
  panelHeight: string;
  panelHeaderHeight: string;
  lineHeight: string;
  crypto: string;
  icon: string;
  social: string;
  gutter: {
    horizontal: string;
    vertical: string;
  };
  button: {
    small: {
      width: string;
      height: string;
    };
    normal: {
      width: string;
      height: string;
    };
    big: {
      width: string;
      height: string;
    };
  };
  tooltip: {
    small: string;
    normal: string;
  };
  font: {
    tiny: string;
    small: string;
    normal: string;
    big: string;
    large: string;
  };
  coin: {
    small: string;
    big: string;
  };
};

type ThemeFont = {
  primary: string;
  pre: string;
};

export type Theme = {
  palette: ThemePalette;
  sizes: ThemeSize;
  fonts: ThemeFont;
};
