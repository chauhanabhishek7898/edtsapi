import { IsInt } from 'class-validator';

export class MePercentageRequest {
  @IsInt()
  TagId: number;

  @IsInt()
  LineId: number;
}