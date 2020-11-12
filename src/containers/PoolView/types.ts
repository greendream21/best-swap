import { PoolData } from '../../helpers/utils/types';
import { PoolDetailStatusEnum } from '../../types/generated/midgard/api';

type PoolViewKey = {
  key: number,
  status: PoolDetailStatusEnum | null,
}

export type PoolViewData = PoolData & PoolViewKey;
