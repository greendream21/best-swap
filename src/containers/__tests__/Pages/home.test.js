import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import Home from '../../pages/Home';

describe('Home Page', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<Home />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
