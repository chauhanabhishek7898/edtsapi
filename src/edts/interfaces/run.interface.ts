import { BaseResponse } from '../../shared/interfaces/base.interface';

export interface RunType {
  ID: number;
  Type: string;
}

export interface MePercentageRequest {
  TagId: number;
  LineId: number;
}

export interface MePercetangeResponse extends BaseResponse {
  MeValueDetail: Array<{ Me: string; Shift: string }>;
}

export interface DataEntry extends BaseResponse {
  MachineID: number;
  Rework: number;
  ReworkType: number;
  Operator: number;
  RunID: number;
  ShiftID: number;
}