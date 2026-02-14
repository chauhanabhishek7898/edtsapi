import { IsInt, IsString, IsOptional } from 'class-validator';
import { BaseResponse } from '../../shared/interfaces/base.interface';

export class Users {
  @IsInt()
  TagID: number;

  @IsInt()
  ID: number;

  @IsString()
  Name: string;
}

// Use interface for response
export interface UserList extends BaseResponse {
  LineID: number;
  UsersList: Users[];
}

export class UserDetailByShiftRequest {
  @IsInt()
  LineId: number;

  @IsInt()
  ShiftID: number;

  @IsInt()
  TagID: number;
}

// Use interface for response
export interface UserDetailByShift extends BaseResponse {
  UserID: number;
  DisplayName: string;
  UserName: string;
  Pin: string;
  Password: string;
  ShiftFromTime: string;
  ShiftToTime: string;
  AlertTimeInMin: number;
  TodayDate: string;
  ShiftId: number;
}

export class SaveOperatorByShiftIDRequest {
  @IsInt()
  LineId: number;

  @IsInt()
  TagID: number;

  @IsInt()
  ShiftID: number;

  @IsInt()
  UserID: number;

  @IsInt()
  @IsOptional()
  UserLOGID?: number;
}

// Use interface for response
export interface SaveOperatorByShiftIDresponse extends BaseResponse {
  UserLogID: number;
}

export class UpdateOperatorLogoutTimeRequest implements BaseResponse {
  @IsInt()
  UserLogID: number;

  @IsInt()
  ReturnCode: number;

  @IsString()
  ReturnMessage: string;
}

export class GetAllOperatorsRequest {
  @IsInt()
  LineID: number;

  @IsInt()
  TagID: number;
}

export class AllOperators {
  @IsInt()
  UserID: number;

  @IsString()
  DisplayName: string;

  @IsString()
  UserName: string;

  @IsString()
  Pin: string;

  @IsString()
  Password: string;
}

// Use interface for response
export interface GetAllOperatorsResponse extends BaseResponse {
  OperatorList: AllOperators[];
}