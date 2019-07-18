import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import Overview from '../../Overview';

describe('Overview Page', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<Overview />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
