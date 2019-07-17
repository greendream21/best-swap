import appLocaleData from 'react-intl/locale-data/en';
import enMessages from '../locales/en_US.json';
// import { getKeys, getValues } from '../conversion';
// getValues(enMessages);

const EnLang = {
  messages: {
    ...enMessages,
  },
  locale: 'en-US',
  data: appLocaleData,
};
export default EnLang;
