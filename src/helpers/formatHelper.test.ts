import { formatNumber, formatCurrency } from './formatHelper';

describe('helpers/formatHelper/', () => {
    describe('formatNumber', () => {
        it('should return a valid value for an integer', () => {
            const result = formatNumber(10);
            expect(result).toEqual('10.00');
        });
        it('should return a valid value for a decimal', () => {
            const result = formatNumber(9.99);
            expect(result).toEqual('9.99');
        });
    });
    describe('formatCurrency', () => {
        it('should return a valid value for an integer', () => {
            const result = formatCurrency(100);
            expect(result).toEqual('$100.00');
        });
        it('should return a valid value for a decimal', () => {
            const result = formatCurrency(1200.99);
            expect(result).toEqual('$1,200.99');
        });
    });
});
