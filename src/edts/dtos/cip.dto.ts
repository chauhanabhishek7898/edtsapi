import { IsInt, IsString, IsOptional } from 'class-validator';
import { BaseResponse } from '../../shared/interfaces/base.interface';

export class CIPList {
  @IsInt()
  ID: number;

  @IsString()
  CIPReason: string;

  @IsInt()
  StandardTime: number;
}

// Use interface for response
export interface CIPReason extends BaseResponse {
  List: CIPList[];
}

export class CIPStartResponse implements BaseResponse {
  @IsInt()
  LineId: number;

  @IsInt()
  ReasonId: number;

  @IsInt()
  UserId: number;

  @IsInt()
  ReturnCode: number;

  @IsString()
  ReturnMessage: string;
}

export class CIPStopResponse implements BaseResponse {
  @IsInt()
  LineId: number;

  @IsString()
  Remark: string;

  @IsInt()
  ReturnCode: number;

  @IsString()
  ReturnMessage: string;
}

export class CIPUpdateRequest {
  @IsInt()
  CIPID: number;

  @IsInt()
  LineId: number;

  @IsInt()
  UserId: number;

  @IsString()
  Remarks: string;
}

// Use interface for response
export interface CIPUpdateResponse extends BaseResponse {}