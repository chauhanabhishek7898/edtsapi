export interface BaseResponse {
  ReturnCode: number;
  ReturnMessage: string;
}

export interface PaginatedResponse<T> extends BaseResponse {
  Data: T[];
  TotalCount: number;
  Page: number;
  PageSize: number;
}

export interface KeyValuePair {
  Key: string;
  Value: any;
}