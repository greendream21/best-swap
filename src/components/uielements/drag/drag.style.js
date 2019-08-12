import styled from 'styled-components';
import { palette } from 'styled-theme';
import { boxShadow } from '../../../settings/style-util';
import Label from '../label';

export const DragWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 190px;
  height: 40px;
  border: 1px solid ${palette('primary', 0)};
  ${props => props.success && `border: 1px solid ${palette('success', 0)}`};
  ${props => props.overlap && `border: 1px solid ${palette('error', 0)}`};

  border-radius: 20px;
  background-color: ${palette('background', 6)};
  ${props => props.success && boxShadow('0px 0px 4px 1px #30D7A9')};
  ${props => props.overlap && boxShadow('0px 0px 4px 1px #FF4954')};

  overflow: hidden;

  .coinIcon-wrapper {
    width: 34px;
    height: 34px;
    border-radius: 50%;
    cursor: pointer;

    img {
      width: 100%;
      height: 100%;
    }
  }

  .source-asset {
    position: absolute;
    left: 2px;
    z-index: 500;

    &:hover {
      ${boxShadow('0px 0px 4px 1px #33CCFF')};
      ${props => props.success && boxShadow('0px 0px 4px 1px #30D7A9')};
      ${props => props.overlap && boxShadow('0px 0px 4px 1px #FF4954')};
    }

    ${props => props.success && boxShadow('0px 0px 4px 1px #30D7A9')};
    ${props => props.overlap && boxShadow('0px 0px 4px 1px #FF4954')};
  }

  .target-asset {
    position: absolute;
    right: 2px;
    opacity: ${props => (props.overlap || props.success ? '1' : '0.5')};
    z-index: 300;

    ${props => props.success && boxShadow('0px 0px 4px 1px #30D7A9')};
    ${props => props.overlap && boxShadow('0px 0px 4px 1px #FF4954')};
  }
`;

export const TitleLabel = styled(Label)`
  width: 190px;
  text-align: center;
  font-style: italic;
`;
