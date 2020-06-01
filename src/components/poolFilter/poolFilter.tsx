import React, { useCallback } from 'react';
import { CheckCircleOutlined, FieldTimeOutlined } from '@ant-design/icons';

import { PoolFilterWrapper } from './poolFilter.style';
import Button from '../uielements/button';
import { PoolDetailStatusEnum } from '../../types/generated/midgard/api';

type Props = {
  selected: PoolDetailStatusEnum;
  onClick: (key: PoolDetailStatusEnum) => void;
};

const PoolFilter: React.FC<Props> = (props: Props): JSX.Element => {
  const { selected, onClick } = props;

  const handleClick = useCallback(
    (key: PoolDetailStatusEnum) => {
      onClick(key);
    },
    [onClick],
  );

  return (
    <PoolFilterWrapper className="pool-filter">
      <Button
        typevalue="outline"
        round="true"
        onClick={() => handleClick(PoolDetailStatusEnum.Enabled)}
        focused={selected === PoolDetailStatusEnum.Enabled}
      >
        <CheckCircleOutlined />
        Active
      </Button>
      <Button
        typevalue="outline"
        round="true"
        onClick={() => handleClick(PoolDetailStatusEnum.Bootstrapped)}
        focused={selected === PoolDetailStatusEnum.Bootstrapped}
      >
        <FieldTimeOutlined />
        Pending
      </Button>
    </PoolFilterWrapper>
  );
};

export default PoolFilter;
