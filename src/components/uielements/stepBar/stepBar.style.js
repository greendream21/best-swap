import styled from 'styled-components';
import { palette } from 'styled-theme';

export const StepBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 9px;

  .step-end-dot,
  .step-start-dot {
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${palette('background', 8)};
  }

  .step-bar-line {
    width: 5px;
    height: 150px;
    border-right: 1px solid ${palette('background', 8)};
  }
`;
