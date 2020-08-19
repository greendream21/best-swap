import React, { Dispatch, SetStateAction } from 'react';
import moment from 'moment';

import {
  ChartContainer,
  HeaderContainer,
  TypeContainer,
  TimeContainer,
  HeaderToggle,
  LineChartContainer,
  LineChart,
} from './poolChart.style';

type ChartDetail = {
  value: number;
  time: string | Date | number;
}

type ChartInfo = {
  liquidity: Array<ChartDetail>,
  volume: Array<ChartDetail>
}

type Props = {
  chartData: ChartInfo;
  textColor: string,
  lineColor: string,
  gradientStart: string,
  gradientStop: string,
  viewMode: string,
};


const renderHeader = (type: string, time: string, onTypeChange: Dispatch<SetStateAction<string>>, onTimeChange: Dispatch<SetStateAction<string>>) => {
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

const renderChart = (
  chartData: ChartInfo,
  type: string,
  time: string,
  textColor: string,
  lineColor: string,
  gradientStart: string,
  gradientStop: string,
  viewMode: string) => {
  const totalDisplayChart = type === 'LIQUIDITY' ? [...chartData.liquidity] : [...chartData.volume];
  const startDate = moment().subtract(7, 'days');
  const filteredByTime = totalDisplayChart.filter(data => {
    if (time === 'ALL') return true;
    return moment(data.time).isBetween(startDate, moment());
  });

  const labels: Array<string> = filteredByTime.map(data => {
    return moment(data.time).format('MMM DD');
  });

  const values: Array<number> = filteredByTime.map(data => data.value);

  const data = (canvas:HTMLCanvasElement) => {
    const ctx = canvas.getContext('2d');
    let gradientStroke: CanvasGradient;

    if (ctx) {
      gradientStroke = ctx.createLinearGradient(0, 100, 0, 500);
      gradientStroke.addColorStop(0, gradientStart);
      gradientStroke.addColorStop(1, gradientStop);
      return {
        labels,
        datasets: [
          {
            fill: true,
            lineTension: 0.1,
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
          lineTension: 0.1,
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
    title: {
      display: false,
    },
    legend: {
      display: false,
    },
    scales: {
      xAxes: [
        {
          gridLines: {
            display: false,
          },
          ticks: {
            autoSkip: true,
            fontSize: viewMode === 'desktop-view' ? '15' : '10',
            fontColor: textColor,
            maxTicksLimit: viewMode === 'desktop-view' ? 5 : 3,
            maxRotation: 0,
          },
        },
      ],
      yAxes: [
        {
          type: 'linear',
          position: 'left',
          stacked: true,
          id: 'value',
          scalePositionLeft: false,
          ticks: {
            autoSkip: true,
            maxTicksLimit: viewMode === 'desktop-view' ? 5 : 3,
            callback(value:string) {
              return `$${value}M`;
            },
            padding: viewMode === 'desktop-view' ? 20 : 0,
            fontSize: viewMode === 'desktop-view' ? '18' : '10',
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
      <LineChart data={data} options={options} />
    </LineChartContainer>
  );
};

const PoolChart: React.FC<Props> = (props: Props): JSX.Element => {
  const { chartData, textColor, lineColor, gradientStart, gradientStop, viewMode } = props;
  const [chartType, setChartType] = React.useState('LIQUIDITY');
  const [chartTime, setChartTime] = React.useState('ALL');

  return (
    <ChartContainer>
      {renderHeader(chartType, chartTime, setChartType, setChartTime)}
      {renderChart(chartData, chartType, chartTime, textColor, lineColor, gradientStart, gradientStop, viewMode)}
    </ChartContainer>
  );
};

export default PoolChart;
