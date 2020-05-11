import styled from 'styled-components';
import { palette } from 'styled-theme';
import { boxShadow } from '../../../settings/style-util';
import Label from '../label';

export const DragWrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 244px;
  height: 40px;
  border: 1px solid ${palette('primary', 0)};
  ${props => props.success && `border: 1px solid ${palette('success', 0)}`};

  border-radius: 20px;
  background-color: ${palette('background', 1)};
  ${props => props.dragging && boxShadow('0px 0px 4px 1px #50E3C2')};
  ${props => props.success && boxShadow('0px 0px 4px 1px #50E3C2')};

  overflow: hidden;

  .coinIcon-wrapper {
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;

    img,
    div {
      width: 100%;
      height: 100%;
    }
    div {
      svg {
        font-size: 18px;
      }
    }
  }

  .source-asset {
    position: absolute;
    left: 4px;
    z-index: 500;
    ${props => props.missed && 'transition: all .8s'};

    &:hover {
      ${boxShadow('0px 0px 4px 1px #50E3C2')};
      ${props => props.success && boxShadow('0px 0px 4px 1px #50E3C2')};
    }

    ${props => props.success && boxShadow('0px 0px 4px 1px #50E3C2')};
  }

  .target-asset {
    position: absolute;
    right: 4px;
    opacity: ${props => (props.overlap || props.success ? '1' : '0.5')};
    z-index: 300;

    ${props => props.success && boxShadow('0px 0px 4px 1px #50E3C2')};
  }
`;

export const TitleLabel = styled(Label)`
  width: 240px;
  text-align: center;
  font-size: 12px;
  text-transform: uppercase;
`;
