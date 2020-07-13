import { crypto } from '@binance-chain/javascript-sdk';
import { client as binanceClient, getPrefix } from '@thorchain/asgardex-binance';
import { BINANCE_NET } from '../../env';

/** verify keystore file with password
 * return address and error fields
 * @param keystore
 * @param password
 */
export const verifyPrivateKey = async (
  keystore: string,
  password: string,
) => {
  try {
    const privateKey = crypto.getPrivateKeyFromKeyStore(keystore, password);

    const bncClient = await binanceClient(BINANCE_NET);
    await bncClient.setPrivateKey(privateKey);
    const address = crypto.getAddressFromPrivateKey(
      privateKey,
      getPrefix(BINANCE_NET),
    );

    return {
      address,
      error: null,
    };
  } catch (error) {
    console.error(error); // eslint-disable-line no-console

    return {
      address: null,
      error,
    };
  }
};
