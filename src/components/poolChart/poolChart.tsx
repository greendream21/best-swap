import React, { Dispatch, SetStateAction } from 'react';
import moment from 'moment';
import { defaults } from 'react-chartjs-2';
import Loader from '../utility/loaders/chart';
import { CodeIcon } from '../icons';

import {
  ChartContainer,
  HeaderContainer,
  TypeContainer,
  TimeContainer,
  HeaderToggle,
  LineChartContainer,
  LineChart,
  ComingSoonWrapper,
  ComingSoonText,
  BlurWrapper,
} from './poolChart.style';

type ChartDetail = {
  value: string;
  time: number;
};

type ChartInfo = {
  liquidity: Array<ChartDetail>;
  volume: Array<ChartDetail>;
  loading: boolean;
};

type Props = {
  chartData: ChartInfo;
  textColor: string;
  lineColor: string;
  gradientStart: string;
  gradientStop: string;
  backgroundGradientStart: string;
  backgroundGradientStop: string;
  viewMode: string;
  basePrice?: string;
};

const abbreviateNumber = (value: number): string => {
  let newValue = value;
  const suffixes = ['', 'K', 'M', 'B', 'T'];
  let suffixNum = 0;

  while (newValue >= 1000) {
    newValue /= 1000;
    suffixNum++;
  }

  return `${newValue}${suffixNum > 0 ? ` ${suffixes[suffixNum]}` : ''}`;
};

const renderHeader = (
  type: string,
  time: string,
  onTypeChange: Dispatch<SetStateAction<string>>,
  onTimeChange: Dispatch<SetStateAction<string>>,
) => {
  return (
    <HeaderContainer>
      <TypeContainer>
        <HeaderToggle
          primary={type === 'LIQUIDITY'}
          onClick={() => {
            if (type !== 'LIQUIDITY') {
              onTypeChange('LIQUIDITY');
            }
          }}
        >
          Liquidity
        </HeaderToggle>
        <HeaderToggle
          primary={type === 'VOLUME'}
          onClick={() => {
            if (type !== 'VOLUME') {
              onTypeChange('VOLUME');
            }
          }}
        >
          Volume
        </HeaderToggle>
      </TypeContainer>
      <TimeContainer>
        <HeaderToggle
          primary={time === 'WEEK'}
          onClick={() => {
            if (time !== 'WEEK') {
              onTimeChange('WEEK');
            }
          }}
        >
          1 Week
        </HeaderToggle>
        <HeaderToggle
          primary={time === 'ALL'}
          onClick={() => {
            if (time !== 'ALL') {
              onTimeChange('ALL');
            }
          }}
        >
          All Time
        </HeaderToggle>
      </TimeContainer>
    </HeaderContainer>
  );
};

defaults.global.defaultFontFamily = '\'Exo 2\'';
defaults.global.defaultFontSize = 14;
defaults.global.defaultFontStyle = 'normal';

const renderChart = (
  chartData: ChartInfo,
  type: string,
  time: string,
  textColor: string,
  lineColor: string,
  gradientStart: string,
  gradientStop: string,
  viewMode: string,
  basePrice: string,
) => {
  const totalDisplayChart =
    type === 'LIQUIDITY' ? [...chartData.liquidity] : [...chartData.volume];
  const startDate = moment().subtract(7, 'days');
  const filteredByTime = totalDisplayChart.filter(data => {
    if (time === 'ALL') return true;
    return moment.unix(data.time).isBetween(startDate, moment());
  });

  const filteredLabels: Array<string> = filteredByTime.map(data => {
    return moment.unix(data.time).format('MMM DD');
  });

  const filteredValues: Array<number> = filteredByTime.map(data =>
    Number(data.value.split(',').join('')),
  );
  const labels: Array<string> = filteredLabels.slice(
    filteredLabels.length <= 5
      ? 0
      : filteredLabels.length - Math.floor(filteredLabels.length / 5) * 5 - 1,
  );
  const values: Array<number> = filteredValues.slice(
    filteredValues.length <= 5
      ? 0
      : filteredValues.length - Math.floor(filteredValues.length / 5) * 5 - 1,
  );

  const data = (canvas: HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    let gradientStroke: CanvasGradient;

    if (ctx) {
      gradientStroke = ctx.createLinearGradient(0, 100, 0, 300);
      gradientStroke.addColorStop(0, gradientStart);
      gradientStroke.addColorStop(1, gradientStop);
      return {
        labels,
        datasets: [
          {
            fill: true,
            lineTension: 0.5,
            backgroundColor: gradientStroke,
            borderColor: lineColor,
            borderCapStyle: 'butt',
            borderDash: [],
            borderDashOffset: 0.0,
            borderJoinStyle: 'miter',
            borderWidth: 2,
            pointBorderColor: lineColor,
            pointBackgroundColor: '#fff',
            pointBorderWidth: 1,
            pointHoverRadius: 1,
            pointHoverBackgroundColor: 'rgba(75,192,192,1)',
            pointHoverBorderColor: 'rgba(220,220,220,1)',
            pointHoverBorderWidth: 1,
            pointRadius: 1,
            pointHitRadius: 50,
            data: values,
          },
        ],
      };
    }

    return {
      labels,
      datasets: [
        {
          fill: false,
          lineTension: 0.2,
          borderColor: '#436eb9',
          borderCapStyle: 'butt',
          borderDash: [],
          borderDashOffset: 0.0,
          borderJoinStyle: 'miter',
          borderWidth: 2,
          pointBorderColor: '#436eb9',
          pointBackgroundColor: '#fff',
          pointBorderWidth: 1,
          pointHoverRadius: 1,
          pointHoverBackgroundColor: 'rgba(75,192,192,1)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
          pointHoverBorderWidth: 0,
          pointRadius: 1,
          pointHitRadius: 50,
          data: values,
        },
      ],
    };
  };

  const options = {
    maintainAspectRatio: false,
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    layout: {
      padding: {
        left: '10px',
        right: '10px',
        top: '10px',
        bottom: '10px',
      },
    },
    animation: {
      duration: 700,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            fontSize: '14',
            fontColor: textColor,
            maxTicksLimit: viewMode === 'desktop-view' ? 5 : 3,
            autoSkipPadding: 5,
            maxRotation: 0,
            callback(value: string) {
              if (Number(value) === 0) {
                return '0';
              }
              return value;
            },
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          stacked: true,
          id: 'value',
          ticks: {
            autoSkip: true,
            maxTicksLimit: viewMode === 'desktop-view' ? 4 : 3,
            callback(value: string) {
              if (basePrice === 'RUNE') {
                if (Number(value) === 0) {
                  return 'ᚱ0';
                }
                return `ᚱ${abbreviateNumber(Number(value))}`;
              }
              if (Number(value) === 0) {
                return '$0';
              }
              return `$${abbreviateNumber(Number(value))}`;
            },
            padding: 10,
            fontSize: '14',
            fontColor: textColor,
          },
          gridLines: {
            display: false,
          },
        },
      ],
    },
  };

  return (
    <LineChartContainer>
      {type === 'LIQUIDITY' && (
        <ComingSoonWrapper>
          <CodeIcon />
          <ComingSoonText>Coming Soon...</ComingSoonText>
        </ComingSoonWrapper>
      )}
      {chartData?.loading && <Loader />}
      {!chartData?.loading && (
        <BlurWrapper isBlur={type === 'LIQUIDITY'}>
          <LineChart data={data} options={options} />
        </BlurWrapper>
      )}
    </LineChartContainer>
  );
};

const PoolChart: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    chartData,
    textColor,
    lineColor,
    gradientStart,
    gradientStop,
    backgroundGradientStart,
    backgroundGradientStop,
    viewMode,
    basePrice = 'RUNE',
  } = props;
  const [chartType, setChartType] = React.useState('VOLUME');
  const [chartTime, setChartTime] = React.useState('ALL');
  return (
    <ChartContainer
      gradientStart={backgroundGradientStart}
      gradientStop={backgroundGradientStop}
    >
      {renderHeader(chartType, chartTime, setChartType, setChartTime)}
      {renderChart(
        chartData,
        chartType,
        chartTime,
        textColor,
        lineColor,
        gradientStart,
        gradientStop,
        viewMode,
        basePrice,
      )}
    </ChartContainer>
  );
};

export default PoolChart;
