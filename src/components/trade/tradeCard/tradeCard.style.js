import styled from 'styled-components';

export const TradeCardWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  border-radius: 4px;
  background-color: #fff;
  padding: 0 20px;

  .status-wrapper {
    margin-right: 40px;
  }

  .reward-status {
    flex-grow: 1;
  }

  .pool-status {
    width: 100px;
  }

  .trade-actions-wrapper {
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    height: 60px;

    .btn-wrapper {
      height: 26px;
    }
  }
`;
