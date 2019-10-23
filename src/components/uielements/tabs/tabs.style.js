import styled from 'styled-components';
import { size, key, palette } from 'styled-theme';

export const StyledTab = component => styled(component)`
  .ant-tabs-bar {
    width: ${props => (props.action ? 'auto' : '100%')};
    border-bottom-width: 0px;
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
    font-size: 12px;
    text-transform: uppercase;

    .ant-tabs-tab {
      padding-top: 18px;
      letter-spacing: 2.5px;
      color: ${palette('text', 1)};
      font-weight: bold;

      &:hover {
        color: ${palette('primary', 1)};
      }
    }

    .ant-tabs-tab-active {
      color: ${palette('text', 0)};
    }

    .ant-tabs-ink-bar {
      bottom: 0px;
      height: 3px;
      background: ${palette('primary', 0)};
    }
  }

  .ant-tabs-content {
    width: 100%;
    height: ${props => (props.action ? '0' : 'auto')};
    padding: ${key('sizes.gutter.vertical', '20px')} 0;
    ${props => props.action && 'padding: 0 0;'}
  }

  .ant-tabs-nav .ant-tabs-tab-disabled,
  .ant-tabs-nav .ant-tabs-tab-disabled:hover {
    color: rgba(0, 0, 0, 0.25);
    cursor: not-allowed;
  }
`;
