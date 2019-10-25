import React, { useCallback, useEffect, useRef, useState } from 'react';
import { debounce } from 'lodash';
import PropTypes from 'prop-types';
import { CoinInputAdvancedView } from './coinInputAdvanced.view';

function getValueFromEvent(event) {
  return event.target.value;
}

const formatNumber = minimumFractionDigits => num => {
  return Number(num || 0).toLocaleString(undefined, {
    minimumFractionDigits,
  });
};

function formatStringToNumber(numStr) {
  return Number(numStr.replace(/,/g, '')); // This will have a localisation problem
}

export function isBroadcastable(numStr) {
  return (
    typeof numStr === 'string' &&
    numStr !== undefined &&
    numStr !== null &&
    !Number.isNaN(formatStringToNumber(numStr)) &&
    !numStr.match(/\.$/)
  );
}

// NOTE: After getting this to work realised
// This can probably be refactored to be more simple by creating two
// custom hooks representing each mode focussed or not and then
// switching between them. No time right now however.
export function useCoinCardInputBehaviour({
  value,
  onChange,
  onFocus,
  useDebounce = false, // defaulting debounce to false as it makes testing hard
  minimumFractionDigits = 2,
}) {
  const valueAsString = String(value || 0);

  const [focus, setFocus] = useState(false);
  const [textFieldValue, setTextFieldValue] = useState(undefined);
  const broadcastRef = useRef(undefined);
  const formatter = focus ? a => a : formatNumber(minimumFractionDigits);

  const outval = formatter(
    textFieldValue !== undefined ? textFieldValue : valueAsString, // allows for empty string ''
  );

  const debouncedOnChange = useCallback(
    useDebounce ? debounce(onChange) : onChange,
  );

  const handleFocus = useCallback(
    event => {
      setFocus(true);
      onFocus && onFocus(event);
      // need to store a ref in a var or
      // target getter will loose it
      const { target } = event;
      setTimeout(() => {
        target.select();
      }, 0);
    },
    [setFocus, onFocus],
  );

  const handleChange = useCallback(() => {
    setFocus(true);
    const val = getValueFromEvent(event);
    const isValidNumber = !Number.isNaN(Number(val));

    if (!isValidNumber && val !== '') return;
    setTextFieldValue(val);
  }, [focus, setTextFieldValue, setFocus]);

  useEffect(() => {
    const numberfiedValueStr = focus
      ? outval
      : String(formatStringToNumber(outval));

    if (isBroadcastable(numberfiedValueStr)) {
      const valToSend = formatStringToNumber(numberfiedValueStr);

      if (!focus && textFieldValue !== undefined) {
        setTextFieldValue(undefined); // clear textfield value for next render
      }

      // only broadcast when we are broadcasting a new value
      if (broadcastRef.current === valToSend) {
        return;
      }
      broadcastRef.current = valToSend;

      debouncedOnChange({
        target: {
          value: valToSend,
        },
      });
    }
  }, [
    focus,
    outval,
    isBroadcastable,
    setTextFieldValue,
    formatStringToNumber,
    textFieldValue,
  ]);

  const handleBlur = useCallback(
    event => {
      event.target.blur();
      setFocus(false);
    },
    [setFocus, focus],
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
    value: outval,
  };
}

export function CoinInputAdvanced({
  value,
  onChange,
  onFocus,
  minimumFractionDigits,
  ...props
}) {
  return (
    <CoinInputAdvancedView
      {...props}
      {...useCoinCardInputBehaviour({
        value,
        onChange,
        onFocus,
        minimumFractionDigits,
        useDebounce: true,
      })}
    />
  );
}
CoinInputAdvanced.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired,
  onFocus: PropTypes.func,
  minimumFractionDigits: PropTypes.number,
};
