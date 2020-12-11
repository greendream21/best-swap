import React from 'react';

import * as Styled from './toolCard.style';

type Props = {
  title: string;
  description: string;
  info: string;
  link: string;
};

const ToolCard: React.FC<Props> = (props: Props): JSX.Element => {
  const { title, description, info, link } = props;

  return (
    <a href={link} target="_blank" rel="noopener noreferrer">
      <Styled.Card>
        <Styled.Title color="primary" weight="bold" size="large">{title}</Styled.Title>
        <Styled.Content>
          <Styled.Description>{description}</Styled.Description>
        </Styled.Content>
        <Styled.Info color="success">{info}</Styled.Info>
      </Styled.Card>
    </a>
  );
};

export default ToolCard;
