import styled from 'styled-components';
import { palette, key } from 'styled-theme';

export const ContentViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  flex: auto;

  padding-top: ${key('sizes.gutter.vertical', '10px')};
  padding-bottom: ${key('sizes.gutter.vertical', '10px')};
  padding-left: ${key('sizes.gutter.horizontal', '30px')};
  padding-right: ${key('sizes.gutter.horizontal', '30px')};

  background: ${props =>
    props.transparent ? 'transparent' : palette('background', 1)};
`;
