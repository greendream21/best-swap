import styled from 'styled-components';
import { palette } from 'styled-theme';
import { media } from './helpers/styleHelper';

import normalFont from './assets/font/Exo2-Regular.otf';

const AppHolder = styled.div`
  @font-face {
    font-family: 'Exo 2';
    src: url(${normalFont});
    font-weight: normal;
  }

  font-family: 'Exo 2';

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
  th,
  td,
  svg {
    margin-bottom: 0;
    text-shadow: 1px 1px 1px rgba(0, 0, 0, 0.004);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    &::selection {
      background: ${palette('primary', 0)};
      color: ${palette('background', 1)};
    }
  }

  a,
  button,
  input,
  .ant-slider > div,
  .ant-table-thead > tr > th,
  .ant-table-tbody > tr > td,
  .ant-tabs-nav .ant-tabs-tab {
    transition: none;
  }

  section.ant-layout {
    background: ${palette('background', 1)};
  }

  .ant-popover {
    .ant-popover-arrow {
      border-color: ${palette('background', 1)};
    }
    .ant-popover-inner {
      background-color: ${palette('background', 1)};
    }
  }

  .ant-popover-inner-content {
    padding: 6px;
    font-size: 11px;
    letter-spacing: 0.5px;
    font-family: 'Montserrat';
    src: url(${normalFont});
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

  .desktop-view {
    display: none;
    ${media.sm`
      display: block;
    `}
  }
`;

export default AppHolder;
