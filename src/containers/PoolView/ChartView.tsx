import React, { useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { bnOrZero } from '@thorchain/asgardex-util';
import { Grid, Row, Col } from 'antd';

import Chart from 'components/chart';
import {
  ChartDetail,
  ChartValues,
  ChartData,
} from 'components/chart/types';

import { getRTStats } from 'redux/midgard/actions';
import { RootState } from 'redux/store';

import { formatMidgardAmount } from 'helpers/stringHelper';

import { StatsChanges } from 'types/generated/midgard/api';

const ChartView = () => {
  const dispatch = useDispatch();
  const isDesktopView = Grid.useBreakpoint()?.md ?? true;

  useEffect(() => {
    dispatch(getRTStats({}));
  }, [dispatch]);

  const [selectedChartVolume, setSelectedChartVolume] = useState('Volume');
  const [selectedChartLiquidity, setSelectedChartLiquidity] = useState('Liquidity');
  const volumeChartIndexes = useMemo(
    () => isDesktopView ? [
      'Volume',
      'Buy',
      'Sell',
    ] : ['Volume', 'Buy', 'Sell'],
    [isDesktopView],
  );
  const liquidityChartIndexes = useMemo(
    () => [
      'Liquidity',
      'Pooled',
    ],
    [],
  );

  const { rtStats, rtStatsLoading } = useSelector((state: RootState) => state.Midgard);

  const initialChartData = useMemo(() => {
    const initialData: ChartData = {};
    const defaultChartValues: ChartValues = {
      allTime: [],
      week: [],
    };

    const chartIndexes = [...volumeChartIndexes, ...liquidityChartIndexes];

    chartIndexes.forEach(chartIndex => {
      initialData[chartIndex] = {
        values: defaultChartValues,
        loading: true,
      };
    });

    return initialData;
  }, [volumeChartIndexes, liquidityChartIndexes]);

  const chartData: ChartData = useMemo(() => {
    if (rtStatsLoading) {
      return initialChartData;
    }

    const { allTimeData, weekData } = rtStats;
    const allTimeVolumeData: ChartDetail[] = [];
    const weekVolumeData: ChartDetail[] = [];
    const allTimeLiquidityData: ChartDetail[] = [];
    const weekLiquidityData: ChartDetail[] = [];
    const allTimeTotalPooledData: ChartDetail[] = [];
    const weekTotalPooledData: ChartDetail[] = [];
    const allTimeTotalBuyData: ChartDetail[] = [];
    const weekTotalBuyData: ChartDetail[] = [];
    const allTimeTotalSellData: ChartDetail[] = [];
    const weekTotalSellData: ChartDetail[] = [];

    const getChartData = (data: StatsChanges) => {
      const time = data?.time ?? 0;
      const volume = {
        time,
        value: formatMidgardAmount(data?.totalVolumeUsd),
      };
      const buyVolume = {
        time,
        value: formatMidgardAmount(data?.buyVolumeUsd),
      };
      const sellVolume = {
        time,
        value: formatMidgardAmount(data?.sellVolumeUsd),
      };
      const totalPooled = {
        time,
        value: formatMidgardAmount(data?.totalRuneDepth),
      };
      const liquidity = {
        time,
        value: formatMidgardAmount(bnOrZero(data?.totalRuneDepthUsd).multipliedBy(2).toNumber()),
      };

      return {
        volume,
        buyVolume,
        sellVolume,
        liquidity,
        totalPooled,
      };
    };

    allTimeData.forEach(data => {
      const {
        volume,
        liquidity,
        totalPooled,
        buyVolume,
        sellVolume,
      } = getChartData(data);
      allTimeVolumeData.push(volume);
      allTimeLiquidityData.push(liquidity);
      allTimeTotalPooledData.push(totalPooled);
      allTimeTotalBuyData.push(buyVolume);
      allTimeTotalSellData.push(sellVolume);
    });

    weekData.forEach(data => {
      const {
        volume,
        liquidity,
        totalPooled,
        buyVolume,
        sellVolume,
      } = getChartData(data);
      weekVolumeData.push(volume);
      weekLiquidityData.push(liquidity);
      weekTotalPooledData.push(totalPooled);
      weekTotalBuyData.push(buyVolume);
      weekTotalSellData.push(sellVolume);
    });

    return {
      Volume: {
        values: {
          allTime: allTimeVolumeData,
          week: weekVolumeData,
        },
        unit: '$',
      },
      Buy: {
        values: {
          allTime: allTimeTotalBuyData,
          week: weekTotalBuyData,
        },
        unit: '$',
      },
      Sell: {
        values: {
          allTime: allTimeTotalSellData,
          week: weekTotalSellData,
        },
        unit: '$',
      },
      Liquidity: {
        values: {
          allTime: allTimeLiquidityData,
          week: weekLiquidityData,
        },
        unit: '$',
        type: 'line',
      },
      Pooled: {
        values: {
          allTime: allTimeTotalPooledData,
          week: weekTotalPooledData,
        },
        unit: 'ᚱ',
        type: 'line',
      },
    };
  }, [rtStats, rtStatsLoading, initialChartData]);


  return (
    <Row gutter={[12, 12]}>
      <Col xs={24} md={12}>
        <Chart
          chartIndexes={volumeChartIndexes}
          chartData={chartData}
          selectedIndex={selectedChartVolume}
          selectChart={setSelectedChartVolume}
        />
      </Col>
      <Col xs={24} md={12}>
        <Chart
          chartIndexes={liquidityChartIndexes}
          chartData={chartData}
          selectedIndex={selectedChartLiquidity}
          selectChart={setSelectedChartLiquidity}
        />
      </Col>
    </Row>
  );
};

export default ChartView;
