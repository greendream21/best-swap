import styled from 'styled-components';
import { palette, font } from 'styled-theme';

import normalFont from './assets/font/Montserrat-Regular.otf';
import lightFont from './assets/font/Montserrat-Light.otf';
import mediumFont from './assets/font/Montserrat-Medium.otf';
import boldFont from './assets/font/Montserrat-Bold.otf';
import italicFont from './assets/font/Montserrat-LightItalic.otf';

const AppHolder = styled.div`
  @font-face {
    font-family: Montserrat;
    src: url(${normalFont});
    font-weight: normal;
  }
  @font-face {
    font-family: Montserrat;
    src: url(${lightFont});
    font-weight: lighter;
  }
  @font-face {
    font-family: Montserrat;
    src: url(${boldFont});
    font-weight: bold;
  }
  @font-face {
    font-family: Montserrat;
    src: url(${mediumFont});
    font-weight: medium;
  }
  @font-face {
    font-family: Montserrat;
    src: url(${italicFont});
    font-weight: italic;
  }

  font-family: ${font('primary', 0)};

  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  a,
  p,
  li,
  input,
  textarea,
  span,
  div,
  img,
  svg {
    &::selection {
      background: ${palette('primary', 0)};
      color: #fff;
    }
  }

  .ant-row:not(.ant-form-item) {
    ${'' /* margin-left: -8px;
    margin-right: -8px; */};
    &:before,
    &:after {
      display: none;
    }
  }

  .ant-row > div {
    padding: 0;
  }
`;

export default AppHolder;
