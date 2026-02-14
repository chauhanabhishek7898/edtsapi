export interface DatabaseResult {
  recordsets: any[];
  recordset: any;
  output: any;
  rowsAffected: number[];
}

export interface StoredProcedureParam {
  name: string;
  type: any;
  value: any;
}

export interface QueryOptions {
  timeout?: number;
  transaction?: any;
}