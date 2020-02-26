import React, { useCallback, useEffect, useRef, useState } from 'react';
import { InputSizes } from 'antd/lib/input/Input';
import { CoinInputAdvancedView } from './coinInputAdvanced.view';
import { emptyString } from '../../../../helpers/stringHelper';

const formatNumber = (value: string, minimumFractionDigits: number) => {
  return Number(value || 0).toLocaleString(undefined, {
    minimumFractionDigits,
  });
};

function formatStringToNumber(value: string): number {
  return Number(value.replace(/,/g, '')); // (Rudi) This will have a localisation problem
}

export function isBroadcastable(value: string) {
  return (
    typeof value === 'string' &&
    value !== undefined &&
    value !== null &&
    value !== '' &&
    !Number.isNaN(formatStringToNumber(value)) &&
    !value.match(/\.$/)
  );
}

const DEFAULT_FIELD_VALUE = undefined;

type BehaviorProps = {
  value: number;
  onChangeValue: (value: number) => void;
  onFocus: (() => void) | undefined;
  minimumFractionDigits?: number;
};
// NOTE (Rudi): After getting this to work realised
// This can probably be refactored to be more simple by creating two
// custom hooks representing each mode focussed or not and then
// switching between them. No time right now however.
export function useCoinCardInputBehaviour({
  value,
  onChangeValue,
  onFocus,
  minimumFractionDigits = 2,
}: BehaviorProps) {
  const valueAsString = String(value || 0);

  const [focus, setFocus] = useState<boolean>(false);
  const [textFieldValue, setTextFieldValue] = useState<string | undefined>(
    DEFAULT_FIELD_VALUE,
  );
  const broadcastRef = useRef<number>(NaN);

  const getOutval = useCallback(() => {
    const txtValue =
      textFieldValue !== undefined ? textFieldValue : valueAsString; // (Rudi) allows for empty string ''
    return focus ? txtValue : formatNumber(txtValue, minimumFractionDigits);
  }, [focus, minimumFractionDigits, textFieldValue, valueAsString]);

  const handleFocus = useCallback(
    event => {
      setFocus(true);
      onFocus && onFocus();
      // (Rudi) need to store a ref in a var or
      // target getter will loose it
      const { target } = event;
      setTimeout(() => {
        target.select();
      }, 0);
    },
    [setFocus, onFocus],
  );

  const handleChange = useCallback(event => {
    setFocus(true);
    let val = event.target.value;
    // Update '.'  to ' 0.'
    const ZERO_DECIMAL = '0.';
    val = val === '.' ? ZERO_DECIMAL : val;
    const isValidNumber = !Number.isNaN(Number(val));
    const validValue =
      isValidNumber || val === emptyString || val === ZERO_DECIMAL;
    if (validValue) {
      setTextFieldValue(val);
    }
  }, []);

  useEffect(() => {
    const numberfiedValueStr = focus
      ? getOutval()
      : String(formatStringToNumber(getOutval()));

    if (isBroadcastable(numberfiedValueStr)) {
      const valToSend = formatStringToNumber(numberfiedValueStr);

      // Update text value to be not empty
      if (valToSend === 0 && textFieldValue === '') {
        setTextFieldValue(numberfiedValueStr);
      }

      if (!focus && textFieldValue !== '') {
        setTextFieldValue(DEFAULT_FIELD_VALUE); // (Rudi) clear textfield value for next render
      }

      // (Rudi) only broadcast when we are broadcasting a new value
      if (broadcastRef.current !== valToSend) {
        broadcastRef.current = valToSend;
        onChangeValue(valToSend);
      }
    }
  }, [focus, getOutval, onChangeValue, setTextFieldValue, textFieldValue]);

  const handleBlur = useCallback(
    event => {
      event.target.blur();
      setFocus(false);
    },
    [setFocus],
  );

  const handleKeyDown = useCallback(
    event => {
      handleBlur(event);
    },
    [handleBlur],
  );

  return {
    onBlur: handleBlur,
    onFocus: handleFocus,
    onChange: handleChange,
    onPressEnter: handleKeyDown,
    value: getOutval(),
  };
}

type Props = {
  value: number;
  onChangeValue: (value: number) => void;
  onFocus?: () => void;
  className?: string;
  size?: typeof InputSizes[number];
  minimumFractionDigits?: number;
};

export const CoinInputAdvanced: React.FC<Props> = ({
  value,
  onChangeValue,
  onFocus,
  className = '',
  minimumFractionDigits = 2,
  size = 'default',
  ...otherProps
}: Props): JSX.Element => {
  return (
    <CoinInputAdvancedView
      className={className}
      size={size}
      {...otherProps}
      {...useCoinCardInputBehaviour({
        value,
        onChangeValue,
        onFocus,
        minimumFractionDigits,
      })}
    />
  );
};
