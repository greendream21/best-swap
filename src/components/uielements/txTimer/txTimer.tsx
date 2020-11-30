import React, { useCallback, useState, useEffect, useMemo } from 'react';

import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';

import useInterval, { INACTIVE_INTERVAL } from 'hooks/useInterval';
import usePrevious from 'hooks/usePrevious';

import { ConfirmIcon, RefundIcon } from '../../icons/timerIcons';
import { TxTimerWrapper } from './txTimer.style';

import 'react-circular-progressbar/dist/styles.css';

interface Props {
  status: boolean;
  value: number;
  /* max. value to count */
  maxValue: number;
  /* max. duration to count (in seconds) - optional */
  maxSec?: number;
  startTime?: number;
  refunded?: boolean;
  className?: string;
}

const TxTimer: React.FC<Props> = (props): JSX.Element => {
  const {
    status = false,
    value,
    maxValue,
    maxSec = 0,
    startTime = Date.now(),
    refunded = false,
    className = '',
  } = props;

  const [totalDuration, setTotalDuration] = useState<number>(0);

  // check if tx has finished, if finished, set duration as 0
  const prevTxStatus = usePrevious(status);
  useEffect(() => {
    if (prevTxStatus === true && status === false) {
      setTotalDuration(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status]);

  const isEnd = useMemo(() => {
    // Check of `maxSec` wins over `maxValue`
    if (maxSec > 0 && totalDuration >= maxSec) {
      return true;
    }
    return value >= maxValue;
  }, [maxSec, value, maxValue, totalDuration]);

  // Callback for counting time differences
  const countSecHandler = useCallback(() => {
    const diff = (Date.now() - startTime) / 1000;
    setTotalDuration(diff);
  }, [startTime]);

  // Interval to count seconds
  const countSecInterval =
    startTime && status && !isEnd ? 100 : INACTIVE_INTERVAL;
  useInterval(countSecHandler, countSecInterval);

  const hide = isEnd && !status;
  const CircularProgressbarStyle = `${
    hide ? 'hide' : ''
  } timerchart-circular-progressbar`;

  const totalDurationString =
    totalDuration < 10
      ? Number(totalDuration).toFixed(1)
      : Math.round(totalDuration).toString();

  return (
    <TxTimerWrapper className={`txTimer-wrapper ${className}`}>
      <div className="timerchart-icon">
        {!status && (
          <div className="confirm-icon">
            {!refunded ? <ConfirmIcon /> : <RefundIcon />}
          </div>
        )}
      </div>
      {status && (
        <CircularProgressbar
          className={CircularProgressbarStyle}
          value={value}
          text={`${totalDurationString}s`}
          strokeWidth={7}
          counterClockwise
          styles={buildStyles({
            textColor: '#23DCC8',
            textSize: '14px',
            pathColor: '#23DCC8',
            trailColor: 'rgba(242, 243, 243, 0.5)',
            pathTransition: 'stroke-dashoffset 0.5s linear 0s',
          })}
        />
      )}
    </TxTimerWrapper>
  );
};

export default TxTimer;
