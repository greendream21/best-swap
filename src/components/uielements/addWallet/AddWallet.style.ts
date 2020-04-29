import styled from 'styled-components';
import { palette } from 'styled-theme';

export const AddWalletWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  .add-wallet-icon {
    display: flex;
    justify-content: center;
    align-items: center;

    width: 100px;
    height: 100px;
    margin-bottom: 20px;
    border-radius: 50%;
    background: ${palette('background', 1)};
    svg {
      width: 60px;
      height: 60px;
    }
  }

  .connect-wallet-label {
    font-size: 14px;
    letter-spacing: 1px;
    text-transform: uppercase;
  }
`;
