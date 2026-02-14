import { BaseResponse } from '../../shared/interfaces/base.interface';

export interface MasterDataList {
  ButtonName: string;
  ButtonActiveColor: string;
  ButtonDeactiveColor: string;
  FontColor: string;
  CIPID: number;
  API: string;
  Status: number;
  NextApi: any;
  Keys: any;
  Position: number;
}

export interface LineMaster {
  LineID: number;
  LineType: string;
  LineName: string;
  LineCode: string;
  PlantName: string;
  PlantID: number;
}

export interface LineList extends BaseResponse {
  Line: LineMaster[];
}

export interface BrandMaster {
  BrandID: number;
  Brand: string;
}

export interface PackMaster {
  PackID: number;
  Pack: string;
}