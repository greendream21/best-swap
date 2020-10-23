import React, { Dispatch, SetStateAction } from 'react';
import moment from 'moment';
import { defaults } from 'react-chartjs-2';
import Loader from '../utility/loaders/chart';
import { abbreviateNumber } from '../../helpers/numberHelper';
import { CodeIcon } from '../icons';

import {
  ChartContainer,
  HeaderContainer,
  TypeContainer,
  TimeContainer,
  HeaderToggle,
  LineChartContainer,
  LineChart,
  BlurWrapper,
  ComingSoonWrapper,
  ComingSoonText,
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
  hasLiquidity?: boolean;
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

defaults.global.defaultFontFamily = 'Exo 2';
defaults.global.defaultFontSize = 14;
defaults.global.defaultFontStyle = 'normal';

const renderChart = (
  hasLiquidity: boolean,
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
  const filteredByTime =
    time === 'ALL'
      ? totalDisplayChart
      : totalDisplayChart.filter(data => {
          return moment.unix(data.time).isBetween(startDate, moment());
        });

  const labels: Array<string> = filteredByTime.map(data => {
    return moment.unix(data.time).format('MMM DD');
  });

  const values: Array<number> = filteredByTime.map(data =>
    Number(data.value.split(',').join('')),
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
    tooltips: {
      callbacks: {
        label: ({ yLabel }: { yLabel: number }) => {
          const unit = basePrice === 'RUNE' ? 'ᚱ' : '$';
          const label = `${unit}${new Intl.NumberFormat().format(
            Math.floor(yLabel),
          )}`;
          return label;
        },
      },
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
      {!hasLiquidity && type === 'LIQUIDITY' && (
        <ComingSoonWrapper>
          <CodeIcon />
          <ComingSoonText>Coming Soon...</ComingSoonText>
        </ComingSoonWrapper>
      )}

      {chartData?.loading && <Loader />}
      {!chartData?.loading && (
        <BlurWrapper isBlur={type === 'LIQUIDITY' && !hasLiquidity}>
          <LineChart data={data} options={options} />
        </BlurWrapper>
      )}
    </LineChartContainer>
  );
};

const PoolChart: React.FC<Props> = (props: Props): JSX.Element => {
  const {
    hasLiquidity = true,
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
        hasLiquidity,
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
