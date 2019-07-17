import React from 'react';
import { shallow } from 'enzyme';
import { shallowToJson } from 'enzyme-to-json';

import SignIn from '../../Pages/signin';

describe('SignIn Page', () => {
  it('renders with default props', () => {
    const wrapper = shallow(<SignIn />);
    expect(shallowToJson(wrapper)).toMatchSnapshot();
  });
});
