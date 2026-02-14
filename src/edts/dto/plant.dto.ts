export class PlantRequest {
  PlantID?: number;
  RegionID?: number;
  Status?: number;
}

export class PlantResponse {
  SrNo: number;
  ID: number;
  Name: string;
  RegionName: string;
  PlantCode: string;
  PlantName: string;
  RegionId: number;
  IsActive: boolean;
  PlantDescription: string;
  PlantAddress: string;
  PlantPhone: string;
  PlantFax: string;
}

export class PlantApiResponse {
  Return_Code: number;
  Return_MESSAGE: string;
  Data?: PlantResponse[];
}