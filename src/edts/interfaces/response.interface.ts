import { BaseResponse } from '../../shared/interfaces/base.interface';

export interface CheckForNotification {
  TagName: string;
  StartTime: string;
  TotalLoss: string;
}

export interface DashboardBD {
  Hour: number;
  Day: number;
  Value: number;
}

export interface DashboardBDRequest {
  LineID: number;
  TagID: number;
}

export interface DashboardBDResponse extends BaseResponse {
  List: DashboardBD[];
}

export interface StartTimeByUserNameList {
  RunStartTime: string;
  Status: number;
  UserName: string;
  LogID: number;
  UserID: number;
}

export interface StartTimeByUserNameRequest {
  LineID: number;
  UserID: number;
  ShiftID: number;
}

export interface StartTimeByUserName extends BaseResponse {
  List: StartTimeByUserNameList[];
}

export interface AssetStatus extends BaseResponse {}

export interface UpdateAssetStatusRequest {
  Status: number;
  TagID: number;
}

export interface CheckUrl extends BaseResponse {}

export interface LossPercentageByLossName {
  Name: string;
  Time: string;
  ColorCode: string;
}

export interface MePerByLine {
  Hour: number;
  MEPer: number;
}

export interface GetDashboardRequest {
  LineID: number;
  TagID: number;
}

export interface GetDashboardResponse extends BaseResponse {
  ME: number;
  LossList: LossPercentageByLossName[];
  MeList: MePerByLine[];
  USLE: number;
}

export interface GetLineList {
  RunID: string;
  BrandName: string;
  CaseCount: string;
  FillerSpeed: string;
  LineId: string;
  ME: string;
}

export interface GetLineListResponse extends BaseResponse {
  LineList: GetLineList[];
}

export interface DownTimeDetail {
  AssetName: string;
  FailureName: string;
  StartTime: string;
  TimeLoss: string;
}

export interface DownTimeRequest {
  UserName: string;
  FromDate: string;
  ToDate: string;
}

export interface DownTimeResponse extends BaseResponse {
  DownTimeList: DownTimeDetail[];
}

export interface Rejections {
  RejectionID: number;
  Tagname: string;
  LineName: string;
  AssetName: string;
  BrandName: string;
  PackName: string;
  LossStructureName: string;
  RejectionLoss: number;
  RejectionDate: string;
}

export interface RejectionRequest extends BaseResponse {
  RejectionID?: number;
  TagID: number;
  LossStructureID: number;
  AssetID: number;
  BrandID: number;
  PackID: number;
  RejectionLoss: number;
  RejectionDate: string;
  LineID: number;
}

export interface RejectionResponse extends BaseResponse {
  rejection: Rejections[];
  StartDateTime: string;
  EndDateTime: string;
}

export interface ShiftData {
  Brand: string;
  Date_Time: string;
  RunStartTime: string;
  ME: string;
  Pack: string;
}

export interface ShiftDataRequest {
  TagId: number;
  LineId: number;
}

export interface ShiftDataResponse extends BaseResponse {
  shiftDataList: ShiftData[];
}

export interface USLERequest {
  LineID: number;
  TagID: number;
}

export interface USLEResponse extends BaseResponse {
  Usle: number;
}