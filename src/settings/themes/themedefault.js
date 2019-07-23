const theme = {};

theme.palette = {
  primary: [
    '#33CCFF', // 0: Default
    '#50E3C2', // 1:
    '#F0B90B', // 2:
    'rgba(51, 204, 255, 0.1)', // 3: Selected Background
    'linear-gradient(47.73deg, #50E3C2 0%, #33CCFF 100%)', // 4: Gradient
    '#ECEEEF', // 5: border col
  ],
  background: [
    '#fff', // 0: header, footer bg
    '#fff', // 1: main bg
    '#F8F9FA', // 2: content bg
    'rgba(51,204,255,0.1)', // 3: selected bg
    '#50E3C2', // 4: green button bg
    '#33CCFF', // 5: lock bg
    '#ECEEEF', // 6: drag, border bg
    'linear-gradient(47.73deg, #50E3C2 0%, #33CCFF 100%)', // 7: gradient bg
  ],
  secondary: [
    '#2d3446', // 0: DarkBlue
    '#f1f3f6', // 1: LightBluish
    '#788195', // 2: LightBlue
    '#E4E6E9', // 3: LightBluish Darken 5%
    '#364d79', // 4:
    '#202739', // 5: DarkBlue Darken 5%
    '#f5f6f8', // 6: LighterBluish
    '#e9ebf1', // 7: DarkBluish
    '#F6F8FB', // 8: LighterBluish Lighten 2%
    '#E9EBEE', // 9: LighterBluish Darken 3%
    '#1a1a1a', // 10: Sidebar submenu select
  ],
  border: [
    '#ECEEEF', // 0: Border
    '#33CCFF', // 1: BorderBlue
  ],
  warning: [
    '#F3BA2F', // 0: Warning
  ],
  success: [
    '#30D7A9', // 0: Success
  ],
  error: [
    '#FF4954', // 0: Error
    '#EC3D3A', // 1: Darken 4%
    '#FF5B58', // 2: Lighten 8%
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
    '#323C47', // 0: HeadingDark
    '#848E9C', // 1: Heading
    '#1C2731', // 2: Active
    '#4A4A4A', // 3: Text Color
    '#B7BBBD', // 4: Darker Text
    '#9B9B9B', // 5: Input Text
    '#919D9D', // 6: Footer Color
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
  headerHeight: '90px',
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
      width: '300px',
      height: '50px',
    },
  },
  font: {
    small: '10px',
    normal: '14px',
    big: '18px',
    input: '15px',
    label: '11px',
    header: '12px',
  },
};

theme.fonts = {
  primary: 'Montserrat Medium, Montserrat Bold, Roboto, sans-serif',
  pre: 'Consolas, Liberation Mono, Menlo, Courier, monospace',
};

export default theme;
