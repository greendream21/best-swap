import { PoolDetailStatusEnum } from './../../types/generated/midgard/api';
import { PoolData } from '../../helpers/utils/types';

type PoolViewKey = {
  key: number,
  status: PoolDetailStatusEnum | null,
}

export type PoolViewData = PoolData & PoolViewKey;
