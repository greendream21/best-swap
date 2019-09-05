import { store } from './store';
import walletActions from './wallet/actions';

export default () =>
  new Promise(() => {
    store.dispatch(walletActions.checkUser());
  });
