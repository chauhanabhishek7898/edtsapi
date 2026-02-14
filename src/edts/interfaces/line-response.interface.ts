import { BaseResponse } from '../../shared/interfaces/base.interface';

export interface clsLine {
  FILLER: string;
  SLEPercentage: string;
  SLEPercentageLABEL: string;
  SKU: string;
  LINE: number;
  CASES: string;
  CASESLABEL: string;
  StartRunTime: string;
}

export interface LineResponse extends BaseResponse {
  LineList: clsLine[];
}