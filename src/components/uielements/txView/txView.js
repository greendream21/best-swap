import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Icon } from 'antd';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import ChangingProgressProvider from '../changingProgressProvider';
import { TimerFullIcon } from '../../icons/timerIcons';

import 'react-circular-progressbar/dist/styles.css';

import { TxViewWrapper } from './txView.style';

class TxView extends Component {
  static propTypes = {
    start: PropTypes.bool,
    onEnd: PropTypes.func,
    onClick: PropTypes.func,
    className: PropTypes.string,
  };

  static defaultProps = {
    start: true,
    className: '',
    onEnd: () => {},
    onClick: () => {},
  };

  state = {
    resetTimer: false,
  };

  componentDidUpdate(prevProps) {
    if (prevProps.start === false && this.props.start === true) {
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

  renderTimerIcon = index => {
    return <TimerFullIcon />;
  };

  render() {
    const { start, onEnd, className, onClick, ...props } = this.props;
    const { resetTimer } = this.state;
    const values = [0, 25, 50, 75, 100];
    let totalDuration = 0;
    let duration;

    return (
      <TxViewWrapper
        className={`txView-wrapper ${className}`}
        onClick={onClick}
        {...props}
      >
        {!start && <TimerFullIcon />}
        {start && (
          <ChangingProgressProvider values={values} reset={resetTimer}>
            {percentage => {
              const durations = [0, 300, 1200, 1000, 300];
              const percentageIndex = values.findIndex(
                value => value === percentage,
              );

              duration = durations[percentageIndex] / 1000;
              totalDuration = (
                Number(totalDuration) + Number(duration)
              ).toFixed(1);

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
                        <Icon type="check" />
                      </div>
                    )}
                  </div>
                  <CircularProgressbar
                    className={CircularProgressbarStyle}
                    value={percentage}
                    strokeWidth={12}
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
        )}
      </TxViewWrapper>
    );
  }
}

export default TxView;
