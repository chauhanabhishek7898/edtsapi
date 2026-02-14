export class PackRequest {
  CompanyID: number;
  PackID?: number = 0;
  LineID?: number = 0;
  Status?: boolean|any = null;
}

export interface PackResponse {
  PackID: number;
  CompanyID: number;
  LineID: number;
  PackCode: string;
  PackName: string;
  IsActive: boolean;
  [key: string]: any;
}

export interface PackApiResponse {
  Return_Code: number;
  Return_MESSAGE: string;
  Data?: PackResponse[];
}