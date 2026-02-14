import { BaseResponse } from '../../shared/interfaces/base.interface';

export interface ShiftMaster {
  Id: number;
  ShiftName: string;
  ShiftFromTime: string;
  ShiftToTime: string;
  AlertTimeInMin: number;
}

export interface ShiftMasterResponse extends BaseResponse {
  ShiftList: ShiftMaster[];
}