import { parseTransfer, isOutboundTx, isRefundTx, getTxResult } from './utils';

describe('swap/utils/', () => {
  describe('isOutboundTx', () => {
    it('should find an outbound tx ', () => {
      const transferEvent = {
        data: {
          M: 'OUTBOUND:anything',
        },
      };
      const result = isOutboundTx(transferEvent);
      expect(result).toBeTruthy();
    });

    it('should not find an outbound tx ', () => {
      const transferEvent = {
        data: {},
      };
      const result = isOutboundTx(transferEvent);
      expect(result).toBeFalsy();
    });
  });

  describe('isRefundTx', () => {
    it('should find a refund tx ', () => {
      const transferEvent = {
        data: {
          M: 'REFUND:anyhting',
        },
      };
      const result = isRefundTx(transferEvent);
      expect(result).toBeTruthy();
    });

    it('should not find refund tx ', () => {
      const transferEvent = {
        data: {},
      };
      const result = isRefundTx(transferEvent);
      expect(result).toBeFalsy();
    });
  });

  describe('parseTransfer', () => {
    it('should parse transfer event ', () => {
      const transferEvent = {
        stream: 'transfers',
        data: {
          e: 'outboundTransferInfo',
          E: 62469789,
          H: '270EDA8CF140052FCB54209190A8F2C53EC1E82F6F2C594BFD6C7CE82165A2BE',
          M: 'SWAP:TUSDB-000::18430000',
          f: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
          t: [
            {
              o: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
              c: [
                {
                  a: 'RUNE-A1F',
                  A: '2.00000000',
                },
              ],
            },
          ],
        },
      };
      const result = parseTransfer(transferEvent);
      const expected = {
        txHash:
          '270EDA8CF140052FCB54209190A8F2C53EC1E82F6F2C594BFD6C7CE82165A2BE',
        txMemo: 'SWAP:TUSDB-000::18430000',
        txFrom: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
        txTo: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
        txToken: 'RUNE-A1F',
        txAmount: '2.00000000',
      };
      expect(result).toEqual(expected);
    });

    it('can not parse anything if event does not include `data` ', () => {
      const transferEvent = {};
      const result = parseTransfer(transferEvent);
      const expected = {
        txHash: undefined,
        txMemo: undefined,
        txFrom: undefined,
        txTo: undefined,
        txToken: undefined,
        txAmount: undefined,
      };

      expect(result).toEqual(expected);
    });

    it('can not parse anything if event includes an empty payload` ', () => {
      const result = parseTransfer({ data: {} });
      const expected = {
        txHash: undefined,
        txMemo: undefined,
        txFrom: undefined,
        txTo: undefined,
        txToken: undefined,
        txAmount: undefined,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('getTxResult', () => {
    it('should return a "refunded" TxResult', () => {
      const tx = {
        data: {
          e: 'outboundTransferInfo',
          E: 62474260,
          H: 'DADB8F2F5CA0402C56B12E78AB48E6A57875B8CFA5E8652E5B72EF68CFBE3544',
          M:
            'REFUND:3B484D9FF242B2378800872B42B39940F22313A12149F0D7933A607189C41E67',
          f: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
          t: [
            {
              o: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
              c: [
                {
                  a: 'RUNE-A1F',
                  A: '2.00000000',
                },
              ],
            },
          ],
        },
      };
      const result = getTxResult({
        tx,
        hash: '3B484D9FF242B2378800872B42B39940F22313A12149F0D7933A607189C41E67',
      });
      const expected = {
        type: 'refund',
        token: 'RUNE-A1F',
        amount: '2.00000000',
      };
      expect(result).toEqual(expected);
    });

    it('should return a "refunded" TxResult', () => {
      const tx = {
        data: {
          e: 'outboundTransferInfo',
          E: 62475857,
          H: '92310CD29ED38769BA3996CABAB2FE4699BC2430913B521E2E7FF5AC48A9AB0D',
          M:
            'OUTBOUND:5782DB87AAD0CDBB01D6429D1CF9F9E0C49AD347FA54A10D6F6D26250C99F280',
          f: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
          t: [
            {
              o: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
              c: [
                {
                  a: 'TUSDB-000',
                  A: '0.12774141',
                },
              ],
            },
          ],
        },
      };
      const result = getTxResult({
        tx,
        hash: '5782DB87AAD0CDBB01D6429D1CF9F9E0C49AD347FA54A10D6F6D26250C99F280',
      });
      const expected = {
        type: 'success',
        token: 'TUSDB-000',
        amount: '0.12774141',
      };
      expect(result).toEqual(expected);
    });
  });
});
