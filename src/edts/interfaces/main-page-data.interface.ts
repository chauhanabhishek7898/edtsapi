import { BaseResponse } from '../../shared/interfaces/base.interface';
import { MasterDataList } from './dashboard.interface';

export interface MainPageDataResponse extends BaseResponse {
  UserID: string;
  LineID: number;
  UserName: string;
  PlantName: string;
  RunID: number;
  RunTime: string;
  HeaderButtonDetail: MasterDataList[];
  PageButtonDetail: MasterDataList[];
  CipStartTime: string;
  CipEndTime: string;
  Duration: string;
  RunStatus: number;
  Name: string;
  StartTime: string;
  Brand: string;
  Pack: string;
  CIPID: number;
  CIPreasonID: number;
  CIPReason: string;
}