export class RegionRequest {
  CompanyId: number;
  RegionID?: number;
}

export class RegionResponse {
  SrNo: number;
  RegionID: number;
  RegionName: string;
  Remarks: string;
}

export class RegionApiResponse {
  Return_Code: number;
  Return_MESSAGE: string;
  Data?: RegionResponse[];
}