import React, { useMemo, useCallback } from 'react';
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
  ChartWrapper,
  BarChart,
  LineChart,
  BlurWrapper,
  ComingSoonWrapper,
  ComingSoonText,
} from './poolChart.style';

type ChartDetail = {
  value: string;
  time: number;
};

type ChartDataType = {
  allTime: ChartDetail[];
  week: ChartDetail[];
};

type ChartInfo = {
  liquidity: ChartDataType;
  volume: ChartDataType;
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
  hasBUSDPrice?: boolean;
};

defaults.global.defaultFontFamily = 'Exo 2';
defaults.global.defaultFontSize = 14;
defaults.global.defaultFontStyle = 'normal';

const PoolChart: React.FC<Props> = React.memo(
  (props: Props): JSX.Element => {
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
      hasBUSDPrice = false,
    } = props;
    const [chartType, setChartType] = React.useState('VOLUME');
    const [chartTime, setChartTime] = React.useState('ALL');

    const totalDisplayChart =
      chartType === 'LIQUIDITY' ? chartData.liquidity : chartData.volume;

    const filteredByTime =
      chartTime === 'ALL' ? totalDisplayChart.allTime : totalDisplayChart.week;

    const labels: Array<string> = filteredByTime.map(data => {
      return moment.unix(data.time).format('MMM DD');
    });

    const values: Array<number> = filteredByTime.map(data =>
      Number(data.value.split(',').join('')),
    );

    const data = useCallback(
      (canvas: HTMLCanvasElement) => {
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
      },
      [gradientStart, gradientStop, labels, lineColor, values],
    );

    const options = useMemo(
      () => ({
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
          duration: 0,
        },
        tooltips: {
          callbacks: {
            label: ({ yLabel }: { yLabel: number }) => {
              const unit = !hasBUSDPrice ? 'ᚱ' : '$';
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
                  if (!hasBUSDPrice) {
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
      }),
      [hasBUSDPrice, textColor, viewMode],
    );

    const renderChart = () => {
      return (
        <ChartWrapper>
          {!hasLiquidity && chartType === 'LIQUIDITY' && (
            <ComingSoonWrapper>
              <CodeIcon />
              <ComingSoonText>Coming Soon...</ComingSoonText>
            </ComingSoonWrapper>
          )}

          {chartData?.loading && <Loader />}
          {!chartData?.loading && (
            <BlurWrapper isBlur={chartType === 'LIQUIDITY' && !hasLiquidity}>
              {chartType === 'LIQUIDITY' && (
                <LineChart data={data} options={options} />
              )}
              {chartType !== 'LIQUIDITY' && (
                <BarChart data={data} options={options} />
              )}
            </BlurWrapper>
          )}
        </ChartWrapper>
      );
    };

    const renderHeader = () => {
      return (
        <HeaderContainer>
          <TypeContainer>
            <HeaderToggle
              primary={chartType === 'LIQUIDITY'}
              onClick={() => setChartType('LIQUIDITY')}
            >
              Liquidity
            </HeaderToggle>
            <HeaderToggle
              primary={chartType === 'VOLUME'}
              onClick={() => setChartType('VOLUME')}
            >
              Volume
            </HeaderToggle>
          </TypeContainer>
          <TimeContainer>
            <HeaderToggle
              primary={chartTime === 'WEEK'}
              onClick={() => setChartTime('WEEK')}
            >
              1 Week
            </HeaderToggle>
            <HeaderToggle
              primary={chartTime === 'ALL'}
              onClick={() => setChartTime('ALL')}
            >
              All Time
            </HeaderToggle>
          </TimeContainer>
        </HeaderContainer>
      );
    };

    return (
      <ChartContainer
        gradientStart={backgroundGradientStart}
        gradientStop={backgroundGradientStop}
      >
        {renderHeader()}
        {renderChart()}
      </ChartContainer>
    );
  },
);

export default PoolChart;
