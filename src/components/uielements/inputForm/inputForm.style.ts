import styled from 'styled-components';

type InputFormWrapperProps = {
  reverse: boolean;
};
export const InputFormWrapper = styled.div<InputFormWrapperProps>`
  display: flex;
  flex-direction: column;

  .value-wrapper,
  .title-label {
    display: flex;
    flex-direction: ${props => (props.reverse ? 'row-reverse' : 'row')};
    padding-bottom: 0px;
  }

  .value-wrapper {
    display: flex;
    align-items: center;

    .value-input {
      min-width: 150px;
      width: 150px;
    }

    .name-label {
      margin: 0 4px;
      text-transform: uppercase;
    }
  }
`;
