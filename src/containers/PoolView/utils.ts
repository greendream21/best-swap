import { random } from 'lodash';
import moment from 'moment';

export const generateRandomTimeSeries = (
  minValue: number,
  maxValue: number,
  startDate: string,
) => {
  const series = [];
  for (
    let itr = moment(startDate);
    itr.isBefore(moment.now());
    itr = itr.add(1, 'day')
  ) {
    series.push({
      time: itr.unix(),
      value: (
        minValue +
        (random(100) / 100) * (maxValue - minValue)
      ).toString(),
    });
  }
  return series;
};
