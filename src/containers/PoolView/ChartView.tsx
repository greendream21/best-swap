import React, { useEffect, useMemo, useState } from 'react';

import { useSelector, useDispatch } from 'react-redux';

import { formatBaseAsTokenAmount, baseAmount } from '@thorchain/asgardex-token';
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

import usePrice from 'hooks/usePrice';

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
      'Swap',
      'Add',
      'Withdraw',
    ] : ['Volume', 'Swap'],
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

  const { getUSDPrice, hasBUSDPrice } = usePrice();
  const chartValueUnit = useMemo(() => !hasBUSDPrice ? 'ᚱ' : '$', [hasBUSDPrice]);

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
    const allTimeTotalSwapsData: ChartDetail[] = [];
    const weekTotalSwapsData: ChartDetail[] = [];
    const allTimeTotalAddData: ChartDetail[] = [];
    const weekTotalAddData: ChartDetail[] = [];
    const allTimeTotalWithdrawData: ChartDetail[] = [];
    const weekTotalWithdrawData: ChartDetail[] = [];

    const getChartData = (data: StatsChanges) => {
      const time = data?.time ?? 0;
      const volume = {
        time,
        value: getUSDPrice(bnOrZero(data?.totalVolume)),
      };
      const totalPooled = {
        time,
        value: formatBaseAsTokenAmount(baseAmount(bnOrZero(data?.totalRuneDepth))),
      };
      const liquidity = {
        time,
        value: getUSDPrice(bnOrZero(data?.totalRuneDepth).multipliedBy(2)),
      };

      const buyCount = data?.buyCount ?? 0;
      const sellCount = data?.sellCount ?? 0;
      const swapCount = buyCount + sellCount;
      // buyCount + sellCount
      const totalSwaps = {
        time,
        value: String(swapCount),
      };

      const totalAdd = { time, value: String(data?.stakeCount ?? 0) };
      const totalWithdraw = { time, value: String(data?.withdrawCount ?? 0) };

      return {
        volume,
        liquidity,
        totalPooled,
        totalSwaps,
        totalAdd,
        totalWithdraw,
      };
    };

    allTimeData.forEach(data => {
      const {
        volume,
        liquidity,
        totalPooled,
        totalSwaps,
        totalAdd,
        totalWithdraw,
      } = getChartData(data);
      allTimeVolumeData.push(volume);
      allTimeLiquidityData.push(liquidity);
      allTimeTotalPooledData.push(totalPooled);
      allTimeTotalSwapsData.push(totalSwaps);
      allTimeTotalAddData.push(totalAdd);
      allTimeTotalWithdrawData.push(totalWithdraw);
    });

    weekData.forEach(data => {
      const {
        volume,
        liquidity,
        totalPooled,
        totalSwaps,
        totalAdd,
        totalWithdraw,
      } = getChartData(data);
      weekVolumeData.push(volume);
      weekLiquidityData.push(liquidity);
      weekTotalPooledData.push(totalPooled);
      weekTotalSwapsData.push(totalSwaps);
      weekTotalAddData.push(totalAdd);
      weekTotalWithdrawData.push(totalWithdraw);
    });

    return {
      Volume: {
        values: {
          allTime: allTimeVolumeData,
          week: weekVolumeData,
        },
        unit: chartValueUnit,
      },
      Liquidity: {
        values: {
          allTime: allTimeLiquidityData,
          week: weekLiquidityData,
        },
        unit: chartValueUnit,
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
      Swap: {
        values: {
          allTime: allTimeTotalSwapsData,
          week: weekTotalSwapsData,
        },
      },
      Add: {
        values: {
          allTime: allTimeTotalAddData,
          week: weekTotalAddData,
        },
      },
      Withdraw: {
        values: {
          allTime: allTimeTotalWithdrawData,
          week: weekTotalWithdrawData,
        },
      },
    };
  }, [rtStats, rtStatsLoading, initialChartData, chartValueUnit, getUSDPrice]);


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
