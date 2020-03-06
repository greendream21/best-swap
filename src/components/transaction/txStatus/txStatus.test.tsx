import React from 'react';
import { mount } from 'enzyme';
import { create } from 'react-test-renderer';

import TxStatus, { Props } from './txStatus';

describe('FilterDropdown', () => {
  const inTxDetail: Props = {
    type: 'in',
    data: [
      {
        asset: 'rune',
        amount: 1.25,
      },
    ],
    round: 'left',
  };
  const outTxDetail: Props = {
    type: 'out',
    data: [
      {
        asset: 'rune',
        amount: 1.25,
      },
      {
        asset: 'bnb',
        amount: 12.5,
      },
    ],
    round: 'right',
  };

  const componentIn = mount(<TxStatus {...inTxDetail} />);
  const componentOut = mount(<TxStatus {...outTxDetail} />);

  it('Matches the snapshot', () => {
    const snapshot = create(<TxStatus {...inTxDetail} />);
    expect(snapshot.toJSON()).toMatchSnapshot();
  });

  it('render wrapper div', () => {
    expect(componentIn.find('div.txStatus-wrapper')).toHaveLength(1);
  });
  it('has status type', () => {
    expect(componentIn.find('p.txStatus-type')).toHaveLength(1);
  });
  it('has 1 status content', () => {
    expect(componentIn.find('div.tx-status-content')).toHaveLength(1);
    expect(
      componentIn
        .find('div')
        .children()
        .find('p.txStatus-amount'),
    ).toHaveLength(1);
    expect(
      componentIn
        .find('div')
        .children()
        .find('p.txStatus-asset'),
    ).toHaveLength(1);
  });
  it('has 2 status content', () => {
    expect(componentOut.find('div.tx-status-content')).toHaveLength(2);
    expect(
      componentIn
        .find('div')
        .children()
        .find('p.txStatus-amount'),
    ).toHaveLength(1);
    expect(
      componentIn
        .find('div')
        .children()
        .find('p.txStatus-asset'),
    ).toHaveLength(1);
  });
  it('has seperator', () => {
    expect(
      componentOut
        .find('div.tx-status-content')
        .children()
        .find('div'),
    ).toHaveLength(1);
  });
});
