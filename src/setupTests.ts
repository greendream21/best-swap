import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import { Maybe, Nothing } from './types/bepswap';
import 'jest-localstorage-mock';

declare global {
  // eslint-disable-next-line no-redeclare, @typescript-eslint/no-namespace
  namespace jest {
    interface Matchers<R> {
      toBeNothing(): R;
    }
  }
}

/**
 * Definition of custom matchers
 *
 * More information about custom matchers:
 * https://jestjs.io/docs/en/expect.html#expectextendmatchers
 * */
expect.extend({
  toBeNothing<T>(received: Maybe<T>) {
    const pass = received === Nothing;

    if (pass) {
      return {
        message: () => `Expected ${received} not to be Nothing`,
        pass: true,
      };
    } else {
      return {
        message: () => `Expected ${received} to be Nothing`,
        pass: false,
      };
    }
  },
});

Enzyme.configure({ adapter: new Adapter() });
