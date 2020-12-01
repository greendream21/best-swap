import React, { useMemo } from 'react';

import { defaults } from 'react-chartjs-2';
import { useSelector } from 'react-redux';

import themes, { ThemeType } from '@thorchain/asgardex-theme';
import { Grid } from 'antd';
import moment from 'moment';

import { RootState } from 'redux/store';

import usePrice from 'hooks/usePrice';

import { abbreviateNumber } from 'helpers/numberHelper';

import { CodeIcon } from '../icons';
import Loader from '../utility/loaders/chart';
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
import { ChartData, ChartTimeFrame } from './types';
import { getDisplayData, getRandomChartData } from './utils';

type Props = {
  chartData: ChartData;
  chartIndexes: string[];
  selectedIndex: string;
  selectChart: (value: string) => void;
};

defaults.global.defaultFontFamily = 'Exo 2';
defaults.global.defaultFontSize = 14;
defaults.global.defaultFontStyle = 'normal';

const PoolChart: React.FC<Props> = React.memo(
  (props: Props): JSX.Element => {
    const { chartIndexes = [], chartData, selectedIndex, selectChart } = props;
    const [chartTimeframe, setChartTimeframe] = React.useState<ChartTimeFrame>(
      'allTime',
    );

    const { hasBUSDPrice } = usePrice();
    const isDesktopView = Grid.useBreakpoint()?.md ?? false;

    const themeType = useSelector((state: RootState) => state.App.themeType);
    const isLight = themeType === ThemeType.LIGHT;
    const theme = isLight ? themes.light : themes.dark;
    const colors = useMemo(
      () => ({
        text: theme.palette.text[0],
        line: isLight ? '#436eb9' : '#1dd3e6',
        backgroundGradientStart: isLight ? '#e4ebf8' : '#365979',
        backgroundGradientStop: isLight ? '#ffffff' : '#0f1922',
        gradientStart: isLight ? '#c5d3f0' : '#365979',
        gradientStop: isLight ? '#ffffff' : '#0f1922',
      }),
      [isLight, theme],
    );
    const randomData = useMemo(() => getRandomChartData(), []);

    const selectedChartData = chartData?.[selectedIndex];
    const isComingSoonChart = selectedChartData?.comingSoon ?? false;
    const isChartLoading = selectedChartData?.loading ?? false;
    const selectedChartType = selectedChartData?.type ?? 'bar';
    const selectedChartValues = selectedChartData?.values;
    const filteredByTime = selectedChartValues?.[chartTimeframe] ?? [];

    const labels: Array<string> = filteredByTime.map(data => {
      return moment.unix(data.time).format('MMM DD');
    });

    const values: Array<number> = filteredByTime.map(data =>
      Number(data.value.split(',').join('')),
    );

    const getData = useMemo(() => getDisplayData({ labels, values, colors }), [
      labels,
      values,
      colors,
    ]);

    const getRandomSeries = useMemo(
      () =>
        getDisplayData({
          labels: randomData.labels,
          values: randomData.values,
          colors,
        }),
      [randomData, colors],
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
                fontColor: colors.text,
                maxTicksLimit: isDesktopView ? 5 : 3,
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
                maxTicksLimit: isDesktopView ? 4 : 3,
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
                fontColor: colors.text,
              },
              gridLines: {
                display: false,
              },
            },
          ],
        },
      }),
      [hasBUSDPrice, colors, isDesktopView],
    );

    const renderComingSoonChart = () => {
      return (
        <>
          <ComingSoonWrapper>
            <CodeIcon />
            <ComingSoonText>Coming Soon...</ComingSoonText>
          </ComingSoonWrapper>
          <BlurWrapper isBlur>
            <LineChart data={getRandomSeries} options={options} />
          </BlurWrapper>
        </>
      );
    };

    const renderChart = () => {
      if (isComingSoonChart) {
        return renderComingSoonChart();
      }

      if (isChartLoading) {
        return <Loader />;
      }

      if (selectedChartType === 'bar') {
        return <BarChart data={getData} options={options} />;
      }

      return <LineChart data={getData} options={options} />;
    };

    const renderHeader = () => {
      return (
        <HeaderContainer>
          <TypeContainer>
            {chartIndexes.map(chartIndex => (
              <HeaderToggle
                primary={selectedIndex === chartIndex}
                onClick={() => selectChart(chartIndex)}
              >
                {chartIndex}
              </HeaderToggle>
            ))}
          </TypeContainer>
          <TimeContainer>
            <HeaderToggle
              primary={chartTimeframe === 'week'}
              onClick={() => setChartTimeframe('week')}
            >
              1 Week
            </HeaderToggle>
            <HeaderToggle
              primary={chartTimeframe === 'allTime'}
              onClick={() => setChartTimeframe('allTime')}
            >
              All Time
            </HeaderToggle>
          </TimeContainer>
        </HeaderContainer>
      );
    };

    return (
      <ChartContainer
        gradientStart={colors.backgroundGradientStart}
        gradientStop={colors.backgroundGradientStop}
      >
        {renderHeader()}
        <ChartWrapper>{renderChart()}</ChartWrapper>
      </ChartContainer>
    );
  },
);

export default PoolChart;
