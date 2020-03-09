import styled from 'styled-components';
import { palette } from 'styled-theme';

export const AssetInfoWrapper = styled.div`
  display: flex;
  align-items: center;
  padding: 0 8px;
  letter-spacing: 1px;

  .label-wrapper {
    padding: 0;
    text-transform: uppercase;
  }

  .coinData-coin-avatar,
  .asset-avatar {
    margin-right: 12px;
  }

  .asset-label {
    width: 50px;
    font-size: 14px;
    font-weight: 500;
    text-transform: uppercase;
    color: ${palette('text', 0)};
  }
`;
