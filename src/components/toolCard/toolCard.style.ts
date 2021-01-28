import styled from 'styled-components';
import { palette } from 'styled-theme';

import Label from 'components/uielements/label';

import { boxShadow, transition } from 'settings/style-util';

export const Card = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  height: 120px;
  
  background: ${palette('background', 0)};
  padding: 4px 4px;
  border-radius: 4px;
  ${transition()};

  &:hover {
    ${boxShadow('0px 1px 4px 0px #00c0ff')}
  }

  &:before {
    content: '';
    position: absolute;
    width: 6px;
    height: 120px;
    left: 8px;
    top: 8px;
    border-bottom-left-radius: 3px;
    border-top-left-radius: 3px;
    background: ${palette('gradient', 0)};
  }
`;

export const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  padding: 0 10px;

  height: 50px;
`;

export const Title = styled(Label)`
  padding: 8px 0 4px 0;
`;

export const Description = styled(Label)`
  padding: 4px 0 8px 0;
  text-align: center;
`;

export const Info = styled(Label)`
  padding: 0;
`;
