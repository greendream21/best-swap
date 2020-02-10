import {
  getTxType,
  parseTransfer,
  stakedResult,
  withdrawResult,
} from './utils';
import { TransferEvent } from '../../types/binance';

describe('pool/utils/', () => {
  describe('parseTransfer', () => {
    it('should parse transfer event ', () => {
      const transferEvent: TransferEvent = {
        stream: 'transfers',
        data: {
          e: 'outboundTransferInfo',
          E: 62300085,
          H: 'B30C9097A9068E06EFDA76747000B92BB5987D699F81F06B38EFCCB745AE576F',
          M: 'STAKE:TUSDB-000',
          f: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
          t: [
            {
              o: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
              c: [
                {
                  a: 'RUNE-A1F',
                  A: '2.00000000',
                },
                {
                  a: 'TUSDB-000',
                  A: '0.18900000',
                },
              ],
            },
          ],
        },
      };
      const result = parseTransfer(transferEvent);
      const expected = {
        txHash:
          'B30C9097A9068E06EFDA76747000B92BB5987D699F81F06B38EFCCB745AE576F',
        txMemo: 'STAKE:TUSDB-000',
        txFrom: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
        txTo: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
        txData: [
          {
            a: 'RUNE-A1F',
            A: '2.00000000',
          },
          {
            a: 'TUSDB-000',
            A: '0.18900000',
          },
        ],
      };

      expect(result).toEqual(expected);
    });

    describe('stakedResult', () => {
      it('should validate a stake transfer', () => {
        const { fromAddr, toToken, toAddr, runeAmount, tokenAmount } = {
          fromAddr: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
          toAddr: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
          toToken: 'TUSDB-000',
          runeAmount: 2,
          tokenAmount: 0.189,
        };
        const tx: TransferEvent = {
          stream: 'transfers',
          data: {
            e: 'outboundTransferInfo',
            E: 62312168,
            H:
              '165AC5FFA435C9D2F99A60469801A5153346F107CBB9A124148439FAE6AD8FED',
            M: 'STAKE:TUSDB-000',
            f: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
            t: [
              {
                o: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
                c: [
                  {
                    a: 'RUNE-A1F',
                    A: '2.00000000',
                  },
                  {
                    a: 'TUSDB-000',
                    A: '0.18900000',
                  },
                ],
              },
            ],
          },
        };
        const result = stakedResult({
          tx,
          fromAddr,
          toAddr,
          toToken,
          runeAmount,
          tokenAmount,
        });
        expect(result).toBeTruthy();
      });
    });

    describe('witdrawResult', () => {
      it('should validate a withdraw transfer', () => {
        const tx: TransferEvent = {
          stream: 'transfers',
          data: {
            e: 'outboundTransferInfo',
            E: 62498151,
            H: '1A4C9EB6438CC87B9DD67707770DE662F6212B68A93A5ABCE2DA0AC09B3FDCE1',
            M: 'OUTBOUND:0C48D82F045B5AABD02663551D19CE18D2266E966ABD3A4D5ACBD3762C8EC692',
            f: 'tbnb1nhftlnunw3h6c9wsamfyf8dzmmwm8c9xfjaxmp',
            t: [
              {
                o: 'tbnb13egw96d95lldrhwu56dttrpn2fth6cs0axzaad',
                c: [
                  {
                    a: 'TUSDB-000',
                    A: '0.79146284',
                  },
                ],
              },
            ],
          },
        };
        const result = withdrawResult({
          tx,
          hash: '0C48D82F045B5AABD02663551D19CE18D2266E966ABD3A4D5ACBD3762C8EC692',
        });
        expect(result).toBeTruthy();
      });
    });

    describe('getTxType', () => {
      it('should be stake ', () => {
        const memo = 'STAKE:TUSDB-000';
        const result = getTxType(memo);
        expect(result).toEqual('stake');
      });

      it('should be withdraw ', () => {
        const memo = 'WITHDRAW:BNB-000';
        const result = getTxType(memo);
        expect(result).toEqual('withdraw');
      });

      it('should be unknown', () => {
        const memo = 'XXX:YYY:ZZZ';
        const result = getTxType(memo);
        expect(result).toEqual('unknown');
      });

      it('should be unknown by a missing memo', () => {
        const result = getTxType(undefined);
        expect(result).toEqual('unknown');
      });
    });
  });
});
