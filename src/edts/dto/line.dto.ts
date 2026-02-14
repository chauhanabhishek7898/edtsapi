export class LineRequest {
  LineID?: number = 0;
  PlantID?: number = 0;
  Status?: number|any = null;
}

export interface LineResponse {
  LineID: number;
  LineType: number;
  Name: string;
  LineCode: string;
  LineName: string;
  PlantID: number;
  IsActive: number;
  PlantName: string;
}

export interface LineApiResponse {
  Return_Code: number;
  Return_MESSAGE: string;
  Data?: LineResponse[];
}