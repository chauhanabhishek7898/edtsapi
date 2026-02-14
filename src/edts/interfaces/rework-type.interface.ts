import { BaseResponse } from '../../shared/interfaces/base.interface';

export interface GetReworkType {
  ID: number;
  ReworkType: string;
}

export interface ReworkTypeResponse extends BaseResponse {
  ReworkList: GetReworkType[];
}