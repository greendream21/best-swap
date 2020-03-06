import { getHashFromTransfer, getTxHashFromMemo } from './binance';
import { TransferEvent, TransferEventData } from '../types/binance';

describe('helpers/binance/', () => {
  describe('getHashFromTransfer', () => {
    it('should return hash ', () => {
      const hash =
        '165AC5FFA435C9D2F99A60469801A5153346F107CBB9A124148439FAE6AD8FED';
      const mockData = {
        data: {
          H: hash,
        },
      };
      const result = getHashFromTransfer(mockData);
      expect(result).toEqual(hash);
    });
  });

  describe('getTxHashFromMemo', () => {
    it('should parse a tx hash from memo ', () => {
      const tx: TransferEvent = {
        stream: '',
        data: {
          M:
            'OUTBOUND:AB0EABDDD2922FB82C38754E5F6AB35F249146F2C83B7E17CA6B156144A74C6F',
        } as TransferEventData,
      };
      const result = getTxHashFromMemo(tx);
      expect(result).toEqual(
        'AB0EABDDD2922FB82C38754E5F6AB35F249146F2C83B7E17CA6B156144A74C6F',
      );
    });

    it('could not parse a tx hash from invalid memo ', () => {
      const tx: TransferEvent = {
        stream: '',
        data: { M: 'anything' } as TransferEventData,
      };
      const result = getTxHashFromMemo(tx);
      expect(result).toBeUndefined();
    });
  });
});
