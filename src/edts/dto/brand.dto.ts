export class BrandRequest {
  CompanyID: number;
  BrandID?: number = 0;
  LineID?: number = 0;
  Status?: boolean|any = null;
}

export interface BrandResponse {
  BrandID: number;
  CompanyID: number;
  LineID: number;
  BrandCode: string;
  BrandName: string;
  IsActive: boolean;
  [key: string]: any;
}

export interface BrandApiResponse {
  Return_Code: number;
  Return_MESSAGE: string;
  Data?: BrandResponse[];
}