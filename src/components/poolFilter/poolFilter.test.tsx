import React from 'react';

import { mount } from 'enzyme';

import { PoolDetailStatusEnum } from 'types/generated/midgard';

import PoolFilter from './poolFilter';

describe('PoolFilter', () => {
  const props: {
    onClick: () => void;
    selected: PoolDetailStatusEnum;
  } = {
    onClick: jest.fn(),
    selected: PoolDetailStatusEnum.Enabled,
  };
  const component = mount(<PoolFilter {...props} />);
  it('has wrapper div', () => {
    expect(component.find('div.pool-filter')).toHaveLength(1);
  });
  it('has 2 buttons for enabled and bootstraped status', () => {
    expect(component.find('button')).toHaveLength(2);
  });
  it('has 3 icons', () => {
    expect(component.find('svg')).toHaveLength(3);
  });
});
