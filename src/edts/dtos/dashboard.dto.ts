import { IsInt, IsString, IsOptional } from 'class-validator';
import { BaseResponse } from '../../shared/interfaces/base.interface';

export class DashboardRequest {
  @IsInt()
  RunID: number;

  @IsInt()
  LineID: number;

  @IsInt()
  UserID: number;

  @IsString()
  @IsOptional()
  TabName?: string;
}

export class MeValue {
  @IsString()
  Me: string;

  @IsString()
  Shift: string;
}

export class USLEValue {
  @IsString()
  USLE: string;

  @IsString()
  Shift: string;
}

export class TagDetails {
  @IsInt()
  TagID: number;

  @IsString()
  TagName: string;

  @IsString()
  ButtonName: string;

  @IsString()
  ButtonActiveColor: string;

  @IsString()
  ButtonDeactiveColor: string;

  @IsString()
  FontColor: string;

  @IsInt()
  BPM: number;

  @IsInt()
  StoppageCount: number;

  @IsString()
  StoppageTime: string;

  @IsString()
  StoppageCountLabel: string;

  @IsString()
  StoppageTimeLabel: string;

  @IsString()
  SpeedBMPLabel: string;

  @IsString()
  StartDateLabel: string;

  @IsString()
  StartDate: string;

  @IsInt()
  Status: number;

  @IsInt()
  NotOperationStatus: number;

  MeValueDetail: MeValue[];
  UsleDetail: USLEValue[];

  @IsString()
  USLEPers: string;
}

export class RunDetail {
  @IsInt()
  RunID: number;

  @IsString()
  RunStartTime: string;

  @IsString()
  RunEndTime: string;

  @IsString()
  Brand: string;

  @IsString()
  Pack: string;

  @IsString()
  RunStatus: string;

  @IsString()
  BackColor: string;

  @IsString()
  FontColor: string;
}

export class CIPDetail {
  @IsInt()
  CIPID: number;

  @IsString()
  CIPStartTime: string;

  @IsString()
  CIPEndTime: string;

  @IsString()
  CIPStatus: string;

  @IsString()
  BackColor: string;

  @IsString()
  FontColor: string;
}

// Use interface for response, class for request
export interface DashboardResponse extends BaseResponse {
  LineID: number;
  RunDetail: RunDetail;
  CIPDetail: CIPDetail;
  TagDetail: TagDetails[];
  OEE: number;
}