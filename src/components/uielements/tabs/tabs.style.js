import styled from 'styled-components';
import { size, key, palette } from 'styled-theme';

export const StyledTab = component => styled(component)`
  .ant-tabs-bar {
    width: ${props => (props.action ? 'auto' : '100%')};
    border-bottom-width: 3px;
    border-color: ${palette('primary', 5)};
    .ant-tabs-nav-container,
    .ant-tabs-nav-wrap,
    .ant-tabs-nav-scroll,
    .ant-tabs-nav {
      overflow: visible !important;
    }
  }

  .ant-tabs-nav {
    height: ${size('panelHeaderHeight', '50px')};
    padding: 0 ${key('sizes.gutter.content', '25px')};
    font-size: ${key('sizes.font.normal', '11px')};
    text-transform: uppercase;

    .ant-tabs-tab {
      padding-bottom: 0px;
      padding-top: 26px;
      letter-spacing: 2.5px;
      color: ${palette('text', 1)};
      font-weight: bold;

      &:hover {
        color: ${palette('primary', 0)};
      }
    }

    .ant-tabs-tab-active {
      color: ${palette('text', 0)};
    }

    .ant-tabs-ink-bar {
      bottom: -3px;
      height: 3px;
      background-color: ${palette('primary', 0)};
    }
  }

  .ant-tabs-content {
    width: 100%;
    height: ${props => (props.action ? '0' : 'auto')};
    padding: ${key('sizes.gutter.vertical', '20px')}
      ${key('sizes.gutter.horizontal', '30px')};
    ${props => props.action && 'padding: 0 0;'}
  }
`;
