import { IsInt, IsString } from 'class-validator';

export class PackBrandRequest {
  @IsInt()
  LineID: number;

  @IsString()
  RunType: string;
}