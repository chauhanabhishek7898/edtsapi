import { BaseResponse } from '../../shared/interfaces/base.interface';

export interface MePercetangeResponse extends BaseResponse {
  MeValueDetail: Array<{ Me: string; Shift: string }>;
}