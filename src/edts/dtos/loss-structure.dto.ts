import { IsInt, IsString, IsOptional } from 'class-validator';
import { BaseResponse } from '../../shared/interfaces/base.interface';

export class LosstructureResponse {
  @IsInt()
  LineID: number;

  @IsInt()
  @IsOptional()
  IsRejection?: number;
}

export class LossStructureList {
  @IsInt()
  Id: number;

  @IsString()
  Name: string;
}

// Use interface for response
export interface LossStructure extends BaseResponse {
  LineID: number;
  LossStructureList: LossStructureList[];
}

export class AssetResponse {
  @IsInt()
  LossStructureID: number;
}

export class AssetList {
  @IsInt()
  Id: number;

  @IsString()
  Name: string;
}

// Use interface for response
export interface AssetByLossStructure extends BaseResponse {
  LossStructureID: number;
  AssetList: AssetList[];
}

export class ComponentResponse {
  @IsInt()
  AssetID: number;
}

export class ComponentList {
  @IsInt()
  Id: number;

  @IsString()
  Name: string;
}

// Use interface for response
export interface ComponentByAsset extends BaseResponse {
  AssetID: number;
  ComponentList: ComponentList[];
}

export class FailureResponse {
  @IsInt()
  ComponentID: number;
}

// Use interface for response
export interface FailureByComponentID extends BaseResponse {
  ComponentID: number;
  FailureList: ComponentList[];
}