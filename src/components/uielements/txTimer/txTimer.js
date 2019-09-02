import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ChangingProgressProvider from './ChangingProgressProvider';
import {
  TimerChartIcon1,
  TimerChartIcon2,
  TimerChartIcon3,
  TimerChartIcon4,
} from '../../icons/timerIcons';

import 'react-circular-progressbar/dist/styles.css';

import { TxTimerWrapper } from './txTimer.style';
import ConfirmIcon from '../confirmIcon';

class TxTimer extends Component {
  static propTypes = {
    reset: PropTypes.bool,
    onEnd: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    reset: true,
    onEnd: () => {},
    className: '',
  };

  state = {
    resetTimer: false,
  };

  handleEndTimer = () => {
    this.setState({
      resetTimer: true,
    });
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
    const { reset, onEnd, className, ...props } = this.props;
    const { resetTimer } = this.state;
    const values = [0, 25, 50, 75, 100];
    let totalDuration = 0;
    let duration;

    return (
      <TxTimerWrapper className={`txTimer-wrapper ${className}`} {...props}>
        <ChangingProgressProvider values={values} reset={resetTimer}>
          {percentage => {
            const durations = [0, 300, 1200, 1000, 300];
            const percentageIndex = values.findIndex(
              value => value === percentage,
            );

            duration = durations[percentageIndex] / 1000;
            totalDuration = (Number(totalDuration) + Number(duration)).toFixed(
              1,
            );

            console.log(totalDuration);
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
                  {resetTimer && <ConfirmIcon className="confirm-icon" />}
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
                    pathTransitionDuration: duration,
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
