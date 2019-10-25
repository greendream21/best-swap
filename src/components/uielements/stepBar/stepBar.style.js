import styled from 'styled-components';
import { palette } from 'styled-theme';

export const StepBarWrapper = styled.div`
  display: flex;
  flex-direction: column;

  .step-end-dot,
  .step-start-dot {
    width: 10px;
    height: 10px;
    border-radius: 50%;
    background: ${palette('border', 7)};
  }
`;
