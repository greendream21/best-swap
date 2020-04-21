import styled from 'styled-components';
import { size, key, palette } from 'styled-theme';

export const StyledTab = component => styled(component)`
  .ant-tabs-bar {
    width: ${props => (props.action ? 'auto' : '100%')};
    border-bottom-width: ${props => (props.withBorder ? '1px' : '0px')};
    border-color: ${palette('gray', 0)};

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

    .ant-tabs-tab,
    .ant-tabs-tab a {
      padding-top: 18px;
      letter-spacing: 2.5px;
      color: ${palette('text', 0)};
      font-weight: bold;

      &:hover {
        color: ${palette('primary', 0)};
      }
    }

    .ant-tabs-tab-active,
    .ant-tabs-tab-active a {
      color: ${palette('text', 0)};
    }

    .ant-tabs-ink-bar {
      bottom: 0px;
      height: 3px;
      background: ${palette('gradient', 0)};
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
    color: ${palette('text', 2)};
    cursor: not-allowed;
  }
`;
