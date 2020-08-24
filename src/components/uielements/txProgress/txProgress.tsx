import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import { RefundIcon, ConfirmIcon, TimerFullIcon } from '../../icons/timerIcons';
import useInterval, { INACTIVE_INTERVAL } from '../../../hooks/useInterval';

import { TxProgressWrapper } from './txProgress.style';

import 'react-circular-progressbar/dist/styles.css';

interface Props {
  status: boolean;
  value: number;
  /* max. value to count */
  maxValue: number;
  /* max. duration to count (in seconds) - optional */
  maxSec?: number;
  startTime?: number;
  /* interval for counting (in ms) - optional */
  interval?: number;
  onChange?: () => void;
  onEnd?: () => void;
  onClick?: () => void;
  refunded?: boolean;
  className?: string;
}

const TxProgress: React.FC<Props> = (props): JSX.Element => {
  const {
    status = false,
    value,
    maxValue,
    maxSec = 0,
    startTime = Date.now(),
    onChange = () => {},
    interval = 1000,
    refunded = false,
    onEnd = () => {},
    onClick = () => {},
    className = '',
  } = props;

  const [active, setActive] = useState(false);
  const [totalDuration, setTotalDuration] = useState<number>(0);

  const isEnd = useMemo(() => {
    // Check of `maxSec` wins over `maxValue`
    if (maxSec > 0 && totalDuration >= maxSec) {
      return true;
    }
    return value >= maxValue;
  }, [maxSec, value, maxValue, totalDuration]);

  // Update `active` depending on `status`.
  // Since we handling internal `status` asynchronous the component has to be still `active`
  // even `status` might switched to false

  // Callback for counting
  const countHandler = useCallback(() => {
    onChange();
  }, [onChange]);
  // Interval to inform outside world about counting
  const countInterval = status && !isEnd ? interval : INACTIVE_INTERVAL;

  useInterval(countHandler, countInterval);

  // Callback for counting time differences
  const countSecHandler = useCallback(() => {
    const diff = (Date.now() - startTime) / 1000;
    setTotalDuration(diff);
  }, [startTime]);
  // Interval to count seconds
  const countSecInterval =
    startTime && status && !isEnd ? 100 : INACTIVE_INTERVAL;
  useInterval(countSecHandler, countSecInterval);

  // Reset everything at end
  const handleEndTimer = useCallback(() => {
    onEnd();
    setTotalDuration(0);
    setActive(false);
  }, [onEnd]);

  // Delay the end of counting - for UX purposes only
  useEffect(() => {
    if (isEnd && status) {
      const id = setTimeout(handleEndTimer, 1000);
      return () => clearTimeout(id);
    }
  }, [handleEndTimer, isEnd, status]);

  // Internal `active` state depends on `status`
  useEffect(() => {
    setActive(status);
  }, [status]);

  const hide = isEnd && !active;

  const CircularProgressbarStyle = `${
    hide ? 'hide' : ''
  } timerchart-circular-progressbar`;

  const activeClass = active ? 'active' : '';

  return (
    <>
      <TxProgressWrapper
        className={`txProgress-wrapper ${className} ${activeClass}`}
        onClick={onClick}
      >
        <div className="timerchart-icon">
          {!active && isEnd && (
            <div className="confirm-icon">
              {!refunded ? <ConfirmIcon /> : <RefundIcon />}
            </div>
          )}
          {!hide && <TimerFullIcon />}
        </div>
        {active && (
          <>
            <CircularProgressbar
              className={CircularProgressbarStyle}
              value={value}
              strokeWidth={12}
              counterClockwise
              styles={buildStyles({
                textColor: '#23DCC8',
                textSize: '14px',
                pathColor: '#23DCC8',
                trailColor: 'rgba(242, 243, 243, 0.5)',
                pathTransition: 'stroke-dashoffset 0.5s linear 0s',
              })}
            />
          </>
        )}
      </TxProgressWrapper>
    </>
  );
};

export default TxProgress;
