import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ChangingProgressProvider from '../changingProgressProvider';
import { ConfirmIcon, RefundIcon } from '../../icons/timerIcons';

import 'react-circular-progressbar/dist/styles.css';

import { TxTimerWrapper } from './txTimer.style';

class TxTimer extends Component {
  static propTypes = {
    reset: PropTypes.bool,
    status: PropTypes.bool,
    value: PropTypes.number,
    interval: PropTypes.number,
    txDuration: PropTypes.number,
    onChange: PropTypes.func,
    onEnd: PropTypes.func,
    refunded: PropTypes.bool,
    className: PropTypes.string,
  };

  static defaultProps = {
    reset: true,
    status: false,
    value: 0,
    interval: 1000,
    txDuration: 1000,
    refunded: false,
    onChange: () => {},
    onEnd: () => {},
    className: '',
  };

  state = {
    resetTimer: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.reset === false && this.props.reset === true) {
      this.setState({
        resetTimer: false,
      });
    }
  }

  handleEndTimer = () => {
    const { onEnd } = this.props;

    onEnd();

    this.setState({
      resetTimer: true,
    });
  };

  handleChange = value => {
    const { onChange } = this.props;

    onChange(value);
  };

  render() {
    const {
      value: indexValue,
      reset,
      status,
      interval,
      txDuration,
      onEnd,
      refunded,
      className,
      ...props
    } = this.props;
    const { resetTimer } = this.state;
    const values = [0, 25, 50, 75, 100];
    let totalDuration = 0;
    let duration;

    return (
      <TxTimerWrapper className={`txTimer-wrapper ${className}`} {...props}>
        <ChangingProgressProvider
          values={values}
          reset={resetTimer}
          status={status}
          interval={interval}
          onChange={this.handleChange}
        >
          {percentage => {
            const durations = [0, 300, 1200, 1000, txDuration];

            durations.slice(0, indexValue + 1).forEach(duration => {
              totalDuration += duration / 1000;
            });

            if (totalDuration >= 10) totalDuration = Math.round(totalDuration);
            else totalDuration = Number(totalDuration).toFixed(1);

            const hide = percentage === 100;
            const CircularProgressbarStyle = `${
              resetTimer ? 'hide' : ''
            } timerchart-circular-progressbar`;

            if (hide && !resetTimer) {
              setTimeout(this.handleEndTimer, 1000);
            }

            return (
              <>
                <div className="timerchart-icon">
                  {resetTimer && (
                    <div className="confirm-icon">
                      {!refunded ? <ConfirmIcon /> : <RefundIcon />}
                    </div>
                  )}
                </div>
                <CircularProgressbar
                  className={CircularProgressbarStyle}
                  value={percentage}
                  text={`${totalDuration}s`}
                  strokeWidth={7}
                  counterClockwise
                  repeat={false}
                  styles={buildStyles({
                    textColor: '#50E3C2',
                    textSize: '14px',
                    pathColor: '#50E3C2',
                    trailColor: '#F2F2F2',
                    pathTransition: `stroke-dashoffset ${duration}s linear 0s`,
                  })}
                />
              </>
            );
          }}
        </ChangingProgressProvider>
      </TxTimerWrapper>
    );
  }
}

export default TxTimer;
