import { IsInt, IsString, IsOptional } from 'class-validator';
import { BaseResponse } from '../../shared/interfaces/base.interface';

export class NotificationRequest {
  @IsInt()
  LineID: number;
}

export class CheckForNotification {
  @IsString()
  TagName: string;

  @IsString()
  StartTime: string;

  @IsString()
  TotalLoss: string;
}

// Use interface for response
export interface Notification extends BaseResponse {
  ReturnCode: string|any;
  checkForNotificationsList: CheckForNotification[];
}

export class PushNotificationRequest {
  @IsString()
  tokenID: string;

  @IsString()
  deviceID: string;
}

// Use interface for response
export interface PushNotificationResponse extends BaseResponse {}