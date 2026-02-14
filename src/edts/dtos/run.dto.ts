import { IsInt, IsString, IsOptional } from 'class-validator';
import { BaseResponse } from '../../shared/interfaces/base.interface';

export class RunStartRequest {
  @IsInt()
  LineID: number;
}

export class RunType {
  @IsInt()
  ID: number;

  @IsString()
  Type: string;
}

// Use interface for response
export interface RunStart extends BaseResponse {
  LineID: number;
  StartDate: string;
  RunType: RunType[];
}

export class RunMaster {
  @IsInt()
  CompanyID: number;

  @IsInt()
  RunID: number;
}

// Use interface for response
export interface RunList extends BaseResponse {
  Run: RunMaster[];
}

export class InitiateRun implements BaseResponse {
  @IsInt()
  LineID: number;

  @IsInt()
  BrandID: number;

  @IsInt()
  PackID: number;

  @IsString()
  RunStartTime: string;

  @IsInt()
  PlanCase: number;

  @IsInt()
  RunID: number;

  @IsInt()
  ReturnCode: number;

  @IsString()
  ReturnMessage: string;
}

export class TerminateRun implements BaseResponse {
  @IsInt()
  RunID: number;

  @IsString()
  RunStartTime: string;

  @IsString()
  @IsOptional()
  RunEndTime?: string;

  @IsInt()
  PlanCase: number;

  @IsInt()
  ReturnCode: number;

  @IsString()
  ReturnMessage: string;
}