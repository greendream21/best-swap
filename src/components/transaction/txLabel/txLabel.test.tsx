import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';

import TxLabel from './txLabel';
import { TxDetailsTypeEnum } from '../../../types/generated/midgard';

describe('FilterDropdown', () => {
  const props = {
    type: TxDetailsTypeEnum.Sell,
  };
  const component = mount(<TxLabel {...props} />);

  it('Matches the snapshot', () => {
    const snapshot = create(<TxLabel {...props} />);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  it('render wrapper div', () => {
    expect(component.find('div.txLabel-wrapper')).toHaveLength(1);
  });
  it('has label for tx type', () => {
    expect(component.find('p')).toHaveLength(1);
  });
  it('has label - swap for tx type sell', () => {
    const sellTypeComponent = mount(<TxLabel type={TxDetailsTypeEnum.Sell} />);

    expect(sellTypeComponent.find('p').text()).toBe('swap');
  });
  it('has label - swap for tx type buy', () => {
    const buyTypeComponent = mount(<TxLabel type={TxDetailsTypeEnum.Buy} />);

    expect(buyTypeComponent.find('p').text()).toBe('swap');
  });
  it('has label - stake for tx type stake', () => {
    const stakeTypeComponent = mount(<TxLabel type={TxDetailsTypeEnum.Stake} />);

    expect(stakeTypeComponent.find('p').text()).toBe('stake');
  });
  it('has label - withdraw for tx type withdraw', () => {
    const withdrawTypeComponent = mount(<TxLabel type={TxDetailsTypeEnum.Withdraw} />);

    expect(withdrawTypeComponent.find('p').text()).toBe('withdraw');
  });
  it('has icon', () => {
    expect(component.find('.tx-label-icon')).toHaveLength(1);
    expect(
      component
        .find('.tx-label-icon')
        .children()
        .find('svg'),
    ).toHaveLength(1);
  });
});
