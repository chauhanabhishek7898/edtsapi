import { IsString } from 'class-validator';

export class MainPageDataRequest {
  @IsString()
  UserID: string;
}