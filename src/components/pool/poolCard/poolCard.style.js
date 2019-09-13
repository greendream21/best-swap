import styled from 'styled-components';

export const PoolCardWrapper = styled.div`
  display: flex;
  align-items: center;
  height: 80px;
  border-radius: 4px;
  background-color: #fff;
  padding: 0 20px;

  .status-wrapper {
    margin-right: 40px;
    width: 80px;
  }

  .roi-status {
    flex-grow: 1;
  }

  .pool-status {
    width: 100px;
  }
`;
