import BigNumber from 'bignumber.js';
import PropTypes from 'prop-types';

export enum Denomination {
  BASE = 'BASE', // values for token amounts in base units (no decimal)
  TOKEN = 'TOKEN', // values of token amounts (w/ decimal)
}

type Amount<T> = {
  type: T;
  amount: () => BigNumber;
};

export type BaseAmount = Amount<Denomination.BASE>;
export type TokenAmount = Amount<Denomination.TOKEN>;

export type Amounts = TokenAmount | BaseAmount

// As long as we have JS sources, we do need PropTypes for `TokenAmount` + `BaseAmount`
// TODO (Veado): Remove following types if we have everything written in TypeScript
export const TokenAmountPropType = PropTypes.shape({
  amount: PropTypes.func,
});
export const BaseAmountPropType = PropTypes.shape({
  amount: PropTypes.func,
});
