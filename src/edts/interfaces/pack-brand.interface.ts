import { BaseResponse } from '../../shared/interfaces/base.interface';
import { BrandMaster, PackMaster } from './dashboard.interface';

export interface PackBrand extends BaseResponse {
  LineID: number;
  RunType: string;
  Brand: BrandMaster[];
  Pack: PackMaster[];
}