import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ChangingProgressProvider from '../changingProgressProvider';
import {
  TimerChartIcon1,
  TimerChartIcon2,
  TimerChartIcon3,
  TimerChartIcon4,
  ConfirmIcon,
} from '../../icons/timerIcons';

import 'react-circular-progressbar/dist/styles.css';

import { TxTimerWrapper } from './txTimer.style';

class TxTimer extends Component {
  static propTypes = {
    reset: PropTypes.bool,
    status: PropTypes.bool,
    value: PropTypes.number,
    interval: PropTypes.number,
    onChange: PropTypes.func,
    onEnd: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    reset: true,
    status: false,
    value: 0,
    interval: 1000,
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

  renderTimerIcon = index => {
    const timerIcons = [
      <TimerChartIcon1 />,
      <TimerChartIcon1 />,
      <TimerChartIcon2 />,
      <TimerChartIcon3 />,
      <TimerChartIcon4 />,
    ];

    return timerIcons[index];
  };

  render() {
    const {
      value: indexValue,
      reset,
      status,
      interval,
      onEnd,
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
            const durations = [0, 300, 1200, 1000, 300];
            const percentageIndex = values.findIndex(
              value => value === percentage,
            );

            durations.slice(0, indexValue + 1).forEach(duration => {
              totalDuration += duration / 1000;
            });

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
                  {!resetTimer && this.renderTimerIcon(percentageIndex)}
                  {resetTimer && (
                    <div className="confirm-icon">
                      <ConfirmIcon />
                    </div>
                  )}
                </div>
                <CircularProgressbar
                  className={CircularProgressbarStyle}
                  value={percentage}
                  text={`${totalDuration}sec`}
                  strokeWidth={7}
                  counterClockwise
                  repeat={false}
                  styles={buildStyles({
                    textColor: 'gray',
                    textSize: '14px',
                    pathColor: 'rgba(251,252,254,0.57)',
                    trailColor: 'rgba(0,0,0,0)',
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
