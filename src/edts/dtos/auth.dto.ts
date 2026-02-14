import { IsInt, IsString, IsOptional } from 'class-validator';
import { BaseResponse } from '../../shared/interfaces/base.interface';

export class LoginRequest {
  @IsString()
  username: string;

  @IsString()
  @IsOptional()
  DeviceTokenId?: string;

  @IsString()
  @IsOptional()
  DeviceID?: string;
}

// Use interface for response
export interface LoginResponse extends BaseResponse {
  username: string;
  password: string;
}

export class DeviceCaptureRequest {
  @IsInt()
  SpType: number;

  @IsString()
  DeviceId: string;

  @IsInt()
  @IsOptional()
  UserId?: number;

  @IsInt()
  @IsOptional()
  LineId?: number;
}

// Use interface for response
export interface DeviceCaptureResponse extends BaseResponse {}