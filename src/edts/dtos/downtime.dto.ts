import { IsInt, IsString, IsOptional } from 'class-validator';
import { BaseResponse } from '../../shared/interfaces/base.interface';

export class Stoppage {
  @IsString()
  AssetName: string;

  @IsString()
  ReasonAssetName: string;

  @IsString()
  StartTime: string;

  @IsString()
  EndTime: string;

  @IsString()
  TimeLost: string;

  @IsInt()
  DTID: number;

  @IsString()
  Type: string;
}

export class DowntimeCount {
  @IsInt()
  TotalLine: number;

  @IsInt()
  TotalMachine: number;

  @IsInt()
  TotalMinor: number;
}

// Use interface for response
export interface DowntimeResponse extends BaseResponse {
  LineID: number;
  RunID: number;
  UserID: number;
  LineDowntime: Stoppage[];
  MachineDowntime: Stoppage[];
  MinorStoppage: Stoppage[];
  DTCount: DowntimeCount;
}

export class UpdateDownTime implements BaseResponse {
  @IsInt()
  DTID: number;

  @IsInt()
  LossStructureID: number;

  @IsInt()
  AssetID: number;

  @IsInt()
  ComponentID: number;

  @IsInt()
  FailureID: number;

  @IsString()
  Type: string;

  @IsString()
  Remarks: string;

  @IsInt()
  UserID: number;

  @IsInt()
  ReturnCode: number;

  @IsString()
  ReturnMessage: string;
}

export class DowntimeHistoryRequest {
  @IsString()
  FromDate: string;

  @IsString()
  ToDate: string;
}

export class DowntimeHistoryList {
  @IsString()
  StartTime: string;

  @IsString()
  EndTime: string;

  @IsString()
  ReasonAsset: string;

  @IsString()
  TimeLost: string;

  @IsString()
  Remark: string;
}

// Use interface for response
export interface DowntimeHistoryResponse extends BaseResponse {
  DowntimeList: DowntimeHistoryList[];
}