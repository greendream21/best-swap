import { addLocaleData } from 'react-intl';
import Enlang from './entries/en_US';
import Dalang from './entries/da_DK';

const AppLocale = {
  en: Enlang,
  da: Dalang,
};

addLocaleData(AppLocale.en.data);
addLocaleData(AppLocale.da.data);

export default AppLocale;
