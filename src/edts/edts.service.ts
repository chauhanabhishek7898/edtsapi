import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { sqlConnection } from '../env';
import { DashboardRequest, DashboardResponse } from './dto/dashboard.dto';
import { RegionApiResponse, RegionRequest, RegionResponse } from './dto/region.dto';
import { PlantRequest, PlantApiResponse, PlantResponse } from './dto/plant.dto';
import { BrandRequest, BrandApiResponse, BrandResponse } from './dto/brand.dto';
import { LineRequest, LineApiResponse, LineResponse } from './dto/line.dto';
import { PackRequest, PackApiResponse, PackResponse } from './dto/pack.dto';

@Injectable()
export class EdtsService {
  private pool: sql.ConnectionPool;
  private sqlConnection = sqlConnection;

  constructor() {
    this.pool = new sql.ConnectionPool(sqlConnection);
  }

  // async getDashboardData(oRequest: DashboardRequest): Promise<DashboardResponse> {
  //   const dashboardResponse = new DashboardResponse();

  //   try {
  //     await sql.connect(this.sqlConnection);

  //     const request = new sql.Request();
  //     request.input('Pi_RunID', sql.Int, oRequest.RunID);
  //     request.input('Pi_LineID', sql.Int, oRequest.LineID);

  //     const result = await request.execute('sProc_Dashboard');
  //     console.log("Stored Procedure executed successfully:", JSON.stringify(result));

  //     if (result.recordsets.length > 0) {
  //       const lastTableIndex = result.recordsets.length - 1;
  //       const returnCode = result.recordsets[lastTableIndex][0]?.Return_Code;

  //       if (returnCode === 0) {
  //         // Process Run Details (Table 0)
  //         if (result.recordsets[0] && result.recordsets[0].length > 0) {
  //           const runDetail = this.mapRowToObject(result.recordsets[0][0]);
  //           dashboardResponse.RunDetail = {
  //             RunID: runDetail.RunID || 0,
  //             RunStartTime: runDetail.RunStartTime || '',
  //             RunEndTime: runDetail.RunEndTime || '',
  //             Brand: runDetail.Brand || '',
  //             Pack: runDetail.Pack || '',
  //             RunStatus: runDetail.RunStatus || '',
  //             BackColor: runDetail.BackColor || '',
  //             FontColor: runDetail.FontColor || '',
  //             PlanCase: runDetail.PlanCase || 0
  //           };
  //           dashboardResponse.RunID = runDetail.RunID || 0;
  //         }

  //         // Process CIP Details (Table 1)
  //         if (result.recordsets[1] && result.recordsets[1].length > 0) {
  //           const cipDetail = this.mapRowToObject(result.recordsets[1][0]);
  //           dashboardResponse.CIPDetail = {
  //             CIPID: cipDetail.CIPID || 0,
  //             CipStartTime: cipDetail.CipStartTime || '',
  //             CipEndTime: cipDetail.CipEndTime || '',
  //             CipStatus: cipDetail.CipStatus || '',
  //             BackColor: cipDetail.BackColor || '',
  //             FontColor: cipDetail.FontColor || '',
  //             Reason: cipDetail.Reason || '',
  //             UserID: cipDetail.UserID || 0,
  //             UserName: cipDetail.UserName || '',
  //             Remark: cipDetail.Remark || ''
  //           };
  //         }

  //         // Process Tag Details (Table 2)
  //         if (result.recordsets[2] && result.recordsets[2].length > 0) {
  //           const tagDetails = result.recordsets[2];
  //           const count = tagDetails.length;

  //           for (let i = 0; i < count; i++) {
  //             const row = tagDetails[i];
  //             const tagData = this.mapRowToObject(row);
  //             const isLastTag = (i === count - 1);
  //             const isMETag = tagData.TagID === 200;

  //             let meValueDetail: any[] | null = null;
  //             let usleDetail: any[] | null = null;
  //             let uslePers: any | null = null;

  //             if (isLastTag && isMETag) {
  //               // Process ME and USLE values only for the ME tag (TagID = 200)
  //               meValueDetail = await this.getMeValues(oRequest.LineID, tagData.TagID);
  //               usleDetail = await this.getUSLEValues(oRequest.LineID, tagData.TagID);
  //               uslePers = await this.getUSLEPers(oRequest.LineID, tagData.TagID);
  //             }

  //             dashboardResponse.TagDetail.push({
  //               TagID: tagData.TagID || 0,
  //               TagName: tagData.TagName || '',
  //               ButtonName: tagData.TagName || '',
  //               ButtonActiveColor: tagData.ButtonActiveColor || '#14b158',
  //               ButtonDeactiveColor: tagData.ButtonDeactiveColor || '#14b158',
  //               FontColor: tagData.FontColor || '#ffffff',
  //               BPM: this.getFieldValue(tagData, ['Speed BPM', 'Speed_BPM', 'BPM'], 0),
  //               // BPM: tagData.BPM || 0,
  //               StoppageCount: this.getFieldValue(tagData, ['Stoppage Count', 'Stoppage_Count', 'StoppageCount'], 0),
  //               StoppageTime: this.getFieldValue(tagData, ['Stoppage Time', 'Stoppage_Time', 'StoppageTime'], '00:00'),
  //               SpeedBMPLabel: this.getFieldValue(tagData, ['Speed BPM Label', 'Speed_BPM_Label', 'SpeedBMPLabel'], ''),
  //               StoppageCountLabel: this.getFieldValue(tagData, ['Stoppage Count Label', 'Stoppage_Count_Label', 'StoppageCountLabel'], ''),
  //               StoppageTimeLabel: this.getFieldValue(tagData, ['Stoppage Time Label', 'Stoppage_Time_Label', 'StoppageTimeLabel'], ''),
  //               StartDateLabel: this.getFieldValue(tagData, ['Start Date Label', 'Start_Date_Label', 'StartDateLabel'], ''),
  //               StartDate: this.getFieldValue(tagData, ['Start Date', 'Start_Date', 'StartDate'], ''),
  //               Status: tagData.Status || 0,
  //               NotOperationStatus: tagData.NotOperationStatus || 1,
  //               MeValueDetail: meValueDetail,
  //               UsleDetail: usleDetail,
  //               USLEPers: uslePers,
  //               NextApi: {},
  //               CIPID: 0,
  //               API: null,
  //               Keys: null
  //             });
  //           }
  //         }

  //         // Set LineID
  //         dashboardResponse.LineID = oRequest.LineID;

  //         // Calculate OEE
  //         const runDate = '21-Aug-2025'

  //         // dashboardResponse.RunDetail?.RunStartTime
  //         //   ? new Date(dashboardResponse.RunDetail.RunStartTime).toLocaleDateString('en-GB', {
  //         //       day: '2-digit',
  //         //       month: 'short',
  //         //       year: 'numeric'
  //         //     })
  //         //   : new Date().toLocaleDateString('en-GB', {
  //         //       day: '2-digit',
  //         //       month: 'short',
  //         //       year: 'numeric'
  //         //     });

  //         const oeeResult = await this.getOEE(oRequest.LineID, dashboardResponse.RunID || 0, runDate);
  //         dashboardResponse.OEE = oeeResult;

  //         dashboardResponse.ReturnCode = 0;
  //         dashboardResponse.ReturnMessage = result.recordsets[lastTableIndex][0]?.Return_MESSAGE || '';
  //       } else {
  //         dashboardResponse.ReturnCode = returnCode;
  //         dashboardResponse.ReturnMessage = result.recordsets[lastTableIndex][0]?.Return_MESSAGE || '';
  //       }
  //     }

  //     await this.pool.close();
  //     console.log("dashboardResponse", dashboardResponse);

  //     return dashboardResponse;

  //   } catch (error) {
  //     // Return exact .NET format for errors
  //     return {
  //       TagDetail: [],
  //       RunDetail: null,
  //       CIPDetail: null,
  //       RunID: 0,
  //       LineID: oRequest.LineID,
  //       OEE: 0,
  //       ReturnCode: -3,
  //       ReturnMessage: error.message || "Incorrect locale information provided"
  //     };
  //   }
  // }

  async getDashboardData(oRequest: DashboardRequest): Promise<DashboardResponse> {
    const dashboardResponse = new DashboardResponse();

    try {
      await sql.connect(this.sqlConnection);

      const request = new sql.Request();
      request.input('Pi_RunID', sql.Int, oRequest.RunID);
      request.input('Pi_LineID', sql.Int, oRequest.LineID);

      const result = await request.execute('sProc_Dashboard');
      console.log("Stored Procedure executed successfully:", JSON.stringify(result));

      if (result.recordsets.length > 0) {
        console.log(`Total recordsets: ${result.recordsets.length}`);

        // Debug: Log each recordset
        result.recordsets.forEach((recordset, index) => {
          console.log(`Recordset ${index} length: ${recordset.length}`);
          if (recordset.length > 0) {
            console.log(`Recordset ${index} first row keys:`, Object.keys(recordset[0]));
          }
        });

        const lastTableIndex = result.recordsets.length - 1;
        const returnCode = result.recordsets[lastTableIndex][0]?.Return_Code;

        console.log(`Last table index: ${lastTableIndex}, Return Code: ${returnCode}`);

        if (returnCode === 0) {
          // CORRECT THE TABLE INDEXES BASED ON YOUR CONSOLE LOG
          // From your console log, TagDetail is in recordset[0] (not recordset[2])

          // Process Tag Details - THIS IS TABLE 0 IN YOUR CONSOLE LOG
          if (result.recordsets[0] && result.recordsets[0].length > 0) {
            console.log(`Processing ${result.recordsets[0].length} tag details`);

            const tagDetails = result.recordsets[0];
            const count = tagDetails.length;

            for (let i = 0; i < count; i++) {
              const row = tagDetails[i];
              const tagData = this.mapRowToObject(row);
              const isLastTag = (i === count - 1);
              const isMETag = tagData.TagID === 200;

              console.log(`Processing tag ${i}: ${tagData.TagName} (ID: ${tagData.TagID})`);

              let meValueDetail: any[] | null = null;
              let usleDetail: any[] | null = null;
              let uslePers: any | null = null;

              if (isLastTag && isMETag) {
                // Process ME and USLE values only for the ME tag (TagID = 200)
                meValueDetail = await this.getMeValues(oRequest.LineID, tagData.TagID);
                usleDetail = await this.getUSLEValues(oRequest.LineID, tagData.TagID);
                uslePers = await this.getUSLEPers(oRequest.LineID, tagData.TagID);
              }

              dashboardResponse.TagDetail.push({
                TagID: tagData.TagID || 0,
                TagName: tagData.TagName || '',
                ButtonName: tagData.TagName || '',
                ButtonActiveColor: tagData.ButtonActiveColor || '#14b158',
                ButtonDeactiveColor: tagData.ButtonDeactiveColor || '#14b158',
                FontColor: tagData.FontColor || '#ffffff',
                BPM: this.getFieldValue(tagData, ['Speed BPM', 'Speed_BPM', 'BPM'], 0),
                StoppageCount: this.getFieldValue(tagData, ['Stoppage Count', 'Stoppage_Count', 'StoppageCount'], 0),
                StoppageTime: this.getFieldValue(tagData, ['Stoppage Time', 'Stoppage_Time', 'StoppageTime'], '00:00'),
                SpeedBMPLabel: this.getFieldValue(tagData, ['Speed BPM Label', 'Speed_BPM_Label', 'SpeedBMPLabel'], ''),
                StoppageCountLabel: this.getFieldValue(tagData, ['Stoppage Count Label', 'Stoppage_Count_Label', 'StoppageCountLabel'], ''),
                StoppageTimeLabel: this.getFieldValue(tagData, ['Stoppage Time Label', 'Stoppage_Time_Label', 'StoppageTimeLabel'], ''),
                StartDateLabel: this.getFieldValue(tagData, ['Start Date Label', 'Start_Date_Label', 'StartDateLabel'], ''),
                StartDate: this.getFieldValue(tagData, ['Start Date', 'Start_Date', 'StartDate'], ''),
                Status: tagData.Status || 0,
                NotOperationStatus: tagData.NotOperationStatus || 1,
                MeValueDetail: meValueDetail,
                UsleDetail: usleDetail,
                USLEPers: uslePers,
                NextApi: {},
                CIPID: 0,
                API: null,
                Keys: null
              });
            }
          }

          // Process Run Details - THIS MIGHT BE TABLE 1
          if (result.recordsets[1] && result.recordsets[1].length > 0) {
            console.log("Processing run details");
            const runDetail = this.mapRowToObject(result.recordsets[1][0]);
            dashboardResponse.RunDetail = {
              RunID: runDetail.RunID || 0,
              RunStartTime: runDetail.RunStartTime || '',
              RunEndTime: runDetail.RunEndTime || '',
              Brand: runDetail.Brand || '',
              Pack: runDetail.Pack || '',
              RunStatus: runDetail.RunStatus || '',
              BackColor: runDetail.BackColor || '',
              FontColor: runDetail.FontColor || '#ffffff',
              PlanCase: runDetail.PlanCase || 0
            };
            dashboardResponse.RunID = runDetail.RunID || 0;
          }

          // Process CIP Details - THIS MIGHT BE TABLE 2
          if (result.recordsets[2] && result.recordsets[2].length > 0) {
            console.log("Processing CIP details");
            const cipDetail = this.mapRowToObject(result.recordsets[2][0]);
            dashboardResponse.CIPDetail = {
              CIPID: cipDetail.CIPID || 0,
              CipStartTime: cipDetail.CipStartTime || '',
              CipEndTime: cipDetail.CipEndTime || '',
              CipStatus: cipDetail.CipStatus || '',
              BackColor: cipDetail.BackColor || '',
              FontColor: cipDetail.FontColor || '',
              Reason: cipDetail.Reason || '',
              UserID: cipDetail.UserID || 0,
              UserName: cipDetail.UserName || '',
              Remark: cipDetail.Remark || ''
            };
          }

          // Set LineID
          dashboardResponse.LineID = oRequest.LineID;

          // Calculate OEE
          const runDate = dashboardResponse.RunDetail?.RunStartTime
            ? new Date(dashboardResponse.RunDetail.RunStartTime).toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            })
            : new Date().toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'short',
              year: 'numeric'
            });

          const oeeResult = await this.getOEE(oRequest.LineID, dashboardResponse.RunID || 0, runDate);
          dashboardResponse.OEE = oeeResult;

          dashboardResponse.ReturnCode = 0;
          dashboardResponse.ReturnMessage = result.recordsets[lastTableIndex][0]?.Return_MESSAGE || '';
        } else {
          dashboardResponse.ReturnCode = returnCode;
          dashboardResponse.ReturnMessage = result.recordsets[lastTableIndex][0]?.Return_MESSAGE || '';
        }
      }

      await this.pool.close();
      console.log("dashboardResponse", JSON.stringify(dashboardResponse, null, 2));

      return dashboardResponse;

    } catch (error) {
      console.error("Error in getDashboardData:", error);

      // Return exact .NET format for errors
      return {
        TagDetail: [],
        RunDetail: null,
        CIPDetail: null,
        RunID: 0,
        LineID: oRequest.LineID,
        OEE: 0,
        ReturnCode: -3,
        ReturnMessage: error.message || "Incorrect locale information provided"
      };
    }
  }

  // Helper method to map SQL row to object
  private mapRowToObject(row: any): any {
    const obj = {};
    for (const key in row) {
      if (row.hasOwnProperty(key)) {
        obj[key] = row[key] !== null && row[key] !== undefined ? row[key] : null;
      }
    }
    return obj;
  }

  // Helper method to get field value with multiple possible column names
  private getFieldValue(row: any, fieldNames: string[], defaultValue: any = null): any {
    for (const fieldName of fieldNames) {
      if (row[fieldName] !== undefined && row[fieldName] !== null) {
        return row[fieldName];
      }
    }
    return defaultValue;
  }

  private async getMeValues(lineId: number, tagId: number): Promise<any[] | null> {
    try {
      const request = new sql.Request();
      request.input('Pi_TagId', sql.Int, tagId);
      request.input('Pi_LineId', sql.Int, lineId);
      interface MeValueItem {
        Shift: string;
        Me: any; // Use a more specific type if possible instead of 'any'
      }
      const meValues: MeValueItem[] = [];
      const shifts = ['A', 'B', 'C'];

      for (const shift of shifts) {
        const shiftRequest = new sql.Request();
        shiftRequest.input('Pi_TagId', sql.Int, tagId);
        shiftRequest.input('Pi_LineId', sql.Int, lineId);
        shiftRequest.input('Pv_Shift', sql.VarChar(1), shift);

        const result = await shiftRequest.execute('sProc_MEPerByLineTodayCIP');

        if (result.recordset.length > 0) {
          meValues.push({
            Shift: shift,
            Me: result.recordset[0].MEPer || '0'
          });
        } else {
          meValues.push({
            Shift: shift,
            Me: '0'
          });
        }
      }

      return meValues;
    } catch (error) {
      return [
        { Shift: 'A', Me: '0' },
        { Shift: 'B', Me: '0' },
        { Shift: 'C', Me: '0' }
      ];
    }
  }

  private async getUSLEValues(lineId: number, tagId: number): Promise<any[] | null> {
    try {
      const request = new sql.Request();
      request.input('Pi_TagId', sql.Int, tagId);
      request.input('Pi_LineId', sql.Int, lineId);
      interface USLEValueItem {
        Shift: string;
        USLE: any; // Use a more specific type if possible instead of 'any'
      }
      const usleValues: USLEValueItem[] = [];
      const shifts = ['A', 'B', 'C'];

      for (const shift of shifts) {
        const shiftRequest = new sql.Request();
        shiftRequest.input('Pi_TagId', sql.Int, tagId);
        shiftRequest.input('Pi_LineId', sql.Int, lineId);
        shiftRequest.input('Pv_Shift', sql.VarChar(1), shift);

        const result = await shiftRequest.execute('USLECIP');

        if (result.recordset.length > 0) {
          usleValues.push({
            Shift: shift,
            USLE: result.recordset[0].MEPer || '0'
          });
        } else {
          usleValues.push({
            Shift: shift,
            USLE: '0'
          });
        }
      }

      return usleValues;
    } catch (error) {
      return [
        { Shift: 'A', USLE: '0' },
        { Shift: 'B', USLE: '0' },
        { Shift: 'C', USLE: '0' }
      ];
    }
  }

  private async getUSLEPers(lineId: number, tagId: number): Promise<string | null> {
    try {
      const request = new sql.Request();
      request.input('Pi_LineID', sql.Int, lineId);
      request.input('Pi_TagID', sql.Int, tagId);

      const result = await request.execute('sProc_USLESPerByLineToday');

      return result.recordset[0]?.Result || '0';
    } catch (error) {
      return '0';
    }
  }

  private async getOEE(lineId: number, runId: number, runDate: string): Promise<number> {
    try {
      const request = new sql.Request();
      request.input('RunID', sql.Int, runId);
      request.input('LineID', sql.Int, lineId);
      request.input('RunDT', sql.VarChar(50), runDate);

      const result = await request.execute('sProc_GetOEEDetails');

      if (result.recordset.length > 0) {
        return parseInt(result.recordset[0].OEE) || 0;
      }
      return 0;
    } catch (error) {
      return 0;
    }
  }


  // Add this method to your existing EdtsService
  async getRegionData(regionRequest: RegionRequest): Promise<RegionApiResponse> {
    try {
      await sql.connect(this.sqlConnection);

      const request = new sql.Request();
      request.input('Pi_CompanyId', sql.Int, regionRequest.CompanyId);
      request.input('Pi_RegionID', sql.Int, regionRequest.RegionID || 0);

      const result = await request.execute('sProc_GetRegion');

      if (result.recordsets.length > 0) {
        const returnTable = result.recordsets[result.recordsets.length - 1];
        const returnCode = returnTable[0]?.Return_Code;
        const returnMessage = returnTable[0]?.Return_MESSAGE;

        if (returnCode === 0) {
          // Process region data (first recordset)
          const regionData: RegionResponse[] = result.recordsets[0].map((row: any) => ({
            SrNo: row.SrNo,
            RegionID: row.RegionID,
            RegionName: row.RegionName,
            Remarks: row.Remarks
          }));

          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage,
            Data: regionData
          };
        } else {
          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage
          };
        }
      }

      return {
        Return_Code: -1,
        Return_MESSAGE: 'No data returned from stored procedure'
      };

    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message || 'Failed to fetch region data'
      };
    }
  }


  async getPlantData(plantRequest: PlantRequest): Promise<PlantApiResponse> {
    try {
      await sql.connect(this.sqlConnection);

      const request = new sql.Request();
      request.input('Pi_PlantID', sql.Int, plantRequest.PlantID || 0);
      // request.input('RegionID', sql.Int, plantRequest.RegionID || 0);
      // request.input('Status', sql.Int, plantRequest.Status !== undefined ? plantRequest.Status : null);

      const result = await request.execute('sProc_GetPlant');

      if (result.recordsets.length > 0) {
        const returnTable = result.recordsets[result.recordsets.length - 1];
        const returnCode = returnTable[0]?.Return_Code;
        const returnMessage = returnTable[0]?.Return_MESSAGE;

        if (returnCode === 0) {
          // Process plant data (first recordset)
          const plantData: PlantResponse[] = result.recordsets[0].map((row: any) => ({
            SrNo: row.SrNo,
            ID: row.ID,
            Name: row.Name,
            RegionName: row.RegionName,
            PlantCode: row.PlantCode,
            PlantName: row.PlantName,
            RegionId: row.RegionId,
            IsActive: row.IsActive,
            PlantDescription: row.PlantDescription,
            PlantAddress: row.PlantAddress,
            PlantPhone: row.PlantPhone,
            PlantFax: row.PlantFax
          }));

          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage,
            Data: plantData
          };
        } else {
          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage
          };
        }
      }

      return {
        Return_Code: -1,
        Return_MESSAGE: 'No data returned from stored procedure'
      };

    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message || 'Failed to fetch plant data'
      };
    }
  }



  async getLineData(lineRequest: LineRequest): Promise<LineApiResponse> {
    try {
      await sql.connect(this.sqlConnection);
      const request = new sql.Request();
      request.input('Pi_LineID', sql.Int, lineRequest.LineID || 0);
      // request.input('PlantID', sql.Int, lineRequest.PlantID || 0);
      // request.input('Status', sql.Int, lineRequest.Status !== undefined ? lineRequest.Status : null);
      const result = await request.execute('sProc_GetLine');
      if (result.recordsets.length > 0) {
        const returnTable = result.recordsets[result.recordsets.length - 1];
        const returnCode = returnTable[0]?.Return_Code;
        const returnMessage = returnTable[0]?.Return_MESSAGE;
        if (returnCode === 0) {
          const lineData: LineResponse[] = result.recordsets[0].map((row: any) => ({
            LineID: row.LineID,
            LineType: row.LineType,
            Name: row.Name,
            LineCode: row.LineCode,
            LineName: row.LineName,
            PlantID: row.PlantID,
            IsActive: row.IsActive,
            PlantName: row.PlantName
          }));
          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage,
            Data: lineData
          };
        } else {
          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage
          };
        }
      }
      return {
        Return_Code: -1,
        Return_MESSAGE: 'No data returned from stored procedure'
      };
    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message || 'Failed to fetch line data'
      };
    }
  }

  async getBrandData(brandRequest: BrandRequest): Promise<BrandApiResponse> {
    try {
      await sql.connect(this.sqlConnection);
      const request = new sql.Request();
      request.input('Pi_CompanyID', sql.Int, brandRequest.CompanyID);
      request.input('Pi_BrandID', sql.Int, brandRequest.BrandID || 0);
      // request.input('LineId', sql.Int, brandRequest.LineID || 0);
      // request.input('Status', sql.Bit, brandRequest.Status !== undefined ? brandRequest.Status : null);
      const result = await request.execute('sProc_GetBrand');
      if (result.recordsets.length > 0) {
        const returnTable = result.recordsets[result.recordsets.length - 1];
        const returnCode = returnTable[0]?.Return_Code;
        const returnMessage = returnTable[0]?.Return_MESSAGE;
        if (returnCode === 0) {
          const brandData: BrandResponse[] = result.recordsets[0].map((row: any) => ({
            BrandID: row.BrandID,
            CompanyID: row.CompanyID,
            LineID: row.LineID,
            BrandCode: row.BrandCode,
            BrandName: row.BrandName,
            IsActive: row.IsActive,
            ...row
          }));
          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage,
            Data: brandData
          };
        } else {
          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage
          };
        }
      }
      return {
        Return_Code: -1,
        Return_MESSAGE: 'No data returned from stored procedure'
      };
    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message || 'Failed to fetch brand data'
      };
    }
  }

  async getPackData(packRequest: PackRequest): Promise<PackApiResponse> {
    try {
      await sql.connect(this.sqlConnection);
      const request = new sql.Request();
      request.input('Pi_CompanyID', sql.Int, packRequest.CompanyID);
      request.input('Pi_PackID', sql.Int, packRequest.PackID || 0);
      // request.input('LineId', sql.Int, packRequest.LineID || 0);
      // request.input('Status', sql.Bit, packRequest.Status !== undefined ? packRequest.Status : null);
      const result = await request.execute('sProc_GetPack');
      if (result.recordsets.length > 0) {
        const returnTable = result.recordsets[result.recordsets.length - 1];
        const returnCode = returnTable[0]?.Return_Code;
        const returnMessage = returnTable[0]?.Return_MESSAGE;
        if (returnCode === 0) {
          const packData: PackResponse[] = result.recordsets[0].map((row: any) => ({
            PackID: row.PackID,
            CompanyID: row.CompanyID,
            LineID: row.LineID,
            PackCode: row.PackCode,
            PackName: row.PackName,
            IsActive: row.IsActive,
            ...row
          }));
          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage,
            Data: packData
          };
        } else {
          return {
            Return_Code: returnCode,
            Return_MESSAGE: returnMessage
          };
        }
      }
      return {
        Return_Code: -1,
        Return_MESSAGE: 'No data returned from stored procedure'
      };
    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message || 'Failed to fetch pack data'
      };
    }
  }


  // new dd run and cip methods can be added here
  async getCIPList(): Promise<any> {
    try {
      await sql.connect(this.sqlConnection);
      const request = new sql.Request();
      const result = await request.execute('sProc_cipList');

      if (result.recordsets.length > 0) {
        return {
          Return_Code: 0,
          Return_MESSAGE: 'Success',
          Data: result.recordsets[0].map(row => ({
            ID: row.ID,
            CIPReason: row.CIPReason,
            CIPMin: row.CIPMin
          }))
        };
      }
      return {
        Return_Code: -1,
        Return_MESSAGE: 'No data found'
      };
    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message
      };
    }
  }

  async runStart(runData: any): Promise<any> {
    try {
      await sql.connect(this.sqlConnection);
      const request = new sql.Request();

      // request.input('TransType', sql.VarChar(1), runData.transType || 'I');

      request.input('runID', sql.Int, runData.lineID);

      request.input('lineID', sql.Int, runData.lineID);
      request.input('brandID', sql.Int, runData.brandID);
      request.input('packID', sql.Int, runData.packID);

      // request.input('failurID', sql.Int, runData.packID||1);

      // request.input('PlanCase', sql.Int, runData.planCase);
      request.input('run_StartTime', sql.VarChar(50), runData.runStartTime);
      // request.input('Speed', sql.Int, runData.speed);
      // request.input('run_EndTime', sql.VarChar(50), runData.runEndTime);
      console.log("request", request);

      const result = await request.execute('sProc_AddRunMaster');
      console.log("result", result);
      const returnTable = result.recordsets[result.recordsets.length - 1];
      return {
        Return_Code: 0,
        Return_MESSAGE:  '',
        Data: result.recordsets[0] || []
      };
    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message
      };
    }
  }

  async updateRun(runData: any): Promise<any> {
  try {
    await sql.connect(this.sqlConnection);
    const request = new sql.Request();

    request.input('Pi_LineID', sql.Int, runData.lineID);
    request.input('Pi_BrandID', sql.Int, runData.brandID);
    request.input('Pi_PackID', sql.Int, runData.packID);
    request.input('Pv_RunStartTime', sql.NVarChar(50), runData.runStartTime);
    request.input('Pv_RunEndTime', sql.NVarChar(50), runData.runEndTime);

    console.log("Executing sProc_UpdateRun");

    const result = await request.execute('sProc_UpdateRun');
    console.log("result", result);
    
    const returnTable = result.recordset;
    
    return {
      Return_Code: returnTable[0]?.Return_Code || 0,
      Return_MESSAGE: returnTable[0]?.Return_MESSAGE || '',
      Data: returnTable || []
    };
  } catch (error) {
    return {
      Return_Code: -2,
      Return_MESSAGE: error.message
    };
  }
}

async stopRun(runData: any): Promise<any> {
  try {
    await sql.connect(this.sqlConnection);
    const request = new sql.Request();

    request.input('Pi_LineID', sql.Int, runData.lineID);
    request.input('RunEndTime', sql.NVarChar(200), runData.runEndTime);

    console.log("Executing sProc_StopRUN");

    const result = await request.execute('sProc_StopRUN');
    console.log("result", result);
    
    const returnTable = result.recordset;
    
    return {
      Return_Code: returnTable[0]?.Return_Code || 0,
      Return_MESSAGE: returnTable[0]?.Return_MESSAGE || '',
      Data: returnTable || []
    };
  } catch (error) {
    return {
      Return_Code: -2,
      Return_MESSAGE: error.message
    };
  }
}


  async cipStart(cipData: any): Promise<any> {
    try {
      await sql.connect(this.sqlConnection);
      const request = new sql.Request();

      request.input('Pi_LineID', sql.Int, cipData.lineID);
      request.input('Pi_ReasonID', sql.Int, cipData.reasonID);
      request.input('Pi_UserID', sql.Int, cipData.userID);

      const result = await request.execute('sProc_StartCIP');

      const returnTable = result.recordsets[result.recordsets.length - 1];
      return {
        Return_Code: returnTable[0]?.Return_Code || 0,
        Return_MESSAGE: returnTable[0]?.Return_MESSAGE || '',
        Data: result.recordsets[0] || []
      };
    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message
      };
    }
  }

  async cipStop(cipData: any): Promise<any> {
    try {
      await sql.connect(this.sqlConnection);
      const request = new sql.Request();

      request.input('Pi_LineID', sql.Int, cipData.lineID);
      request.input('Pv_Remark', sql.VarChar(200), cipData.remarks);

      const result = await request.execute('sProc_StopCIP');

      const returnTable = result.recordsets[result.recordsets.length - 1];
      return {
        Return_Code: returnTable[0]?.Return_Code || 0,
        Return_MESSAGE: returnTable[0]?.Return_MESSAGE || '',
        Data: result.recordsets[0] || []
      };
    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message
      };
    }
  }

  async checkRunStatus(lineID: number): Promise<any> {
    try {
      await sql.connect(this.sqlConnection);
      const request = new sql.Request();

      request.input('Pi_LineID', sql.Int, lineID);
      const result = await request.execute('sProc_RunStart');

      const returnTable = result.recordsets[result.recordsets.length - 1];
      return {
        Return_Code: returnTable[0]?.Return_Code || 0,
        Return_MESSAGE: returnTable[0]?.Return_MESSAGE || '',
        Data: result.recordsets[0] || []
      };
    } catch (error) {
      return {
        Return_Code: -2,
        Return_MESSAGE: error.message
      };
    }
  }



  // src/services/edts.service.ts

// For Run
async getActiveRun(runData: any): Promise<any> {
  try {
    await sql.connect(this.sqlConnection);
    const request = new sql.Request();

    request.input('Pi_LineID', sql.Int, runData.lineID);

    console.log("Executing sProc_GetActiveRunByLine");

    const result = await request.execute('sProc_GetActiveRunByLine');
    console.log("result", result);
    
    const returnTable = result.recordset;
    
    return {
      Return_Code: returnTable[0]?.Return_Code || 0,
      Return_MESSAGE: returnTable[0]?.Return_MESSAGE || '',
      Data: result.recordsets[0] || []
    };
  } catch (error) {
    return {
      Return_Code: -2,
      Return_MESSAGE: error.message
    };
  }
}

// For CIP
async getActiveCIP(cipData: any): Promise<any> {
  try {
    await sql.connect(this.sqlConnection);
    const request = new sql.Request();

    request.input('Pi_LineID', sql.Int, cipData.lineID);

    console.log("Executing sProc_GetActiveCIPByLine");

    const result = await request.execute('sProc_GetActiveCIPByLine');
    console.log("result", result);
    
    const returnTable = result.recordset;
    
    return {
      Return_Code: returnTable[0]?.Return_Code || 0,
      Return_MESSAGE: returnTable[0]?.Return_MESSAGE || '',
      Data: result.recordsets[0] || []
    };
  } catch (error) {
    return {
      Return_Code: -2,
      Return_MESSAGE: error.message
    };
  }
}

}

// import { Injectable, HttpException, HttpStatus, Logger } from '@nestjs/common';
// import { DatabaseService } from '../common/database/database.service';
// import { StringUtils } from '../common/utils/string.utils';
// import * as DTO from './dtos';
// import * as Interfaces from './interfaces';
// import { CIPDetail, RunDetail } from './dtos';

// @Injectable()
// export class EdtsService {
//   private readonly logger = new Logger(EdtsService.name);
//   private runID: number = 0;
//   private cipID: number = 0;

//   constructor(private readonly databaseService: DatabaseService) {}

//   async getUserListByURL(oRequest: DTO.RunStartRequest): Promise<DTO.UserList> {
//     try {
//       const query = `select T2.TagID,ID = T1.UserID,Name = T1.UserName
//                      from tbl_usermaster T1
//                      inner join tbl_userdetailmaster T2 on T1.Userid = t2.userid
//                      where T1.UserName like 'Tab%' and T2.Lineid = '${oRequest.LineID}'`;

//       const result = await this.databaseService.getDataTable(query);

//       const userList: DTO.UserList = {
//         LineID: oRequest.LineID,
//         UsersList: [],
//         ReturnCode: 0,
//         ReturnMessage: 'Success',
//       };

//       if (result.length > 0) {
//         result.forEach((row) => {
//           userList.UsersList.push({
//             TagID: row.TagID,
//             ID: row.ID,
//             Name: row.Name,
//           });
//         });
//       } else {
//         userList.ReturnCode = -1;
//         userList.ReturnMessage = 'No User Detail Available';
//       }

//       return userList;
//     } catch (error) {
//       this.logger.error(
//         `GetUserListByURL failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async appStart(
//     oRequest: DTO.MainPageDataRequest,
//   ): Promise<Interfaces.MainPageDataResponse> {
//     try {
//       this.runID = 0;
//       this.cipID = 0;

//       const query = `sProc_MainPageData '${oRequest.UserID}','${oRequest.UserID}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: Interfaces.MainPageDataResponse = {
//         UserID: oRequest.UserID,
//         LineID: 0,
//         UserName: '',
//         PlantName: '',
//         RunID: 0,
//         RunTime: '',
//         ReturnCode: 0,
//         ReturnMessage: '',
//         HeaderButtonDetail: [],
//         PageButtonDetail: [],
//         CipStartTime: '',
//         CipEndTime: '',
//         Duration: '',
//         RunStatus: 0,
//         Name: '',
//         StartTime: '',
//         Brand: '',
//         Pack: '',
//         CIPID: 0,
//         CIPreasonID: 0,
//         CIPReason: '',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           // Process main data
//           const mainData = result.recordsets[0];
//           if (mainData.length > 0) {
//             response.LineID = parseInt(mainData[0].LineID) || 0;
//             response.UserName = mainData[0].UserName || '';
//             response.PlantName = mainData[0].PlantName || '';
//             response.RunTime = mainData[0].RunTime || '';

//             // Process button details
//             mainData.forEach((row: any) => {
//               const masterData: Interfaces.MasterDataList = {
//                 ButtonName: row.ButtonName,
//                 ButtonActiveColor: row.ButtonActiveColor,
//                 ButtonDeactiveColor: row.ButtonDeactiveColor,
//                 FontColor: row.FontColor,
//                 CIPID: parseInt(row.CIPID) || 0,
//                 API: row.API,
//                 Status: 0,
//                 NextApi: {},
//                 Keys: null,
//                 Position: parseInt(row.Position) || 0,
//               };

//               if (row.Position === '1') {
//                 response.HeaderButtonDetail.push(masterData);
//               } else {
//                 response.PageButtonDetail.push(masterData);
//               }
//             });

//             response.ReturnCode = 0;
//             response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//           }
//         } else {
//           response.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           response.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`AppStart failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getRunDetails(oRequest: DTO.RunMaster): Promise<DTO.RunList> {
//     try {
//       const query = `Sproc_GetRun ${oRequest.CompanyID}, ${oRequest.RunID}`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const runList: DTO.RunList = {
//         Run: [],
//         ReturnCode: -1,
//         ReturnMessage: 'No data found',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           const runData = result.recordsets[0];
//           runData.forEach((row: any) => {
//             runList.Run.push({
//               CompanyID: oRequest.CompanyID,
//               RunID: parseInt(row.RunID) || 0,
//               // RunName: row.RunName || '',
//               // StartDate: row.StartDate || ''
//             });
//           });
//           runList.ReturnCode = 0;
//           runList.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           runList.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           runList.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return runList;
//     } catch (error) {
//       this.logger.error(`GetRunDetails failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async runStart(oRequest: DTO.RunStartRequest): Promise<DTO.RunStart> {
//     try {
//       const query = `sProc_RunStart ${oRequest.LineID}`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: DTO.RunStart = {
//         LineID: oRequest.LineID,
//         StartDate: '',
//         RunType: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed to start run',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         const runData = result.recordsets[0];

//         let num = 0;
//         runData.forEach((row: any) => {
//           response.RunType.push({
//             ID: num++,
//             Type: row.RunType || '',
//           });

//           if (!response.StartDate) {
//             response.StartDate = row.StartDate || '';
//           }
//         });

//         if (lastTable.length > 0) {
//           response.ReturnCode = parseInt(lastTable[0].Return_Code) || 0;
//           response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`RunStart failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getLineMaster(): Promise<Interfaces.LineList> {
//     try {
//       const query = 'sProc_GetLine @Status=1';
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const lineList: Interfaces.LineList = {
//         Line: [],
//         ReturnCode: -1,
//         ReturnMessage: 'No data found',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           const lineData = result.recordsets[0];
//           lineData.forEach((row: any) => {
//             lineList.Line.push({
//               LineID: parseInt(row.LineID) || 0,
//               LineType: row.LineType || '',
//               LineName: row.LineName || '',
//               LineCode: row.LineCode || '',
//               PlantName: row.PlantName || '',
//               PlantID: parseInt(row.PlantID) || 0,
//             });
//           });
//           lineList.ReturnCode = 0;
//           lineList.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           lineList.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           lineList.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return lineList;
//     } catch (error) {
//       this.logger.error(`GetLineMaster failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getTagMaster(): Promise<any> {
//     try {
//       const query = 'select * from tbl_TagMaster where isActive=1';
//       const result = await this.databaseService.getDataTable(query);
//       return result;
//     } catch (error) {
//       this.logger.error(`GetTagMaster failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getOEE(lineID: string): Promise<any> {
//     try {
//       const query = `EXEC sProc_GetOEEDetails @ReType='ALL',@RunID=0,@LineID=${lineID}`;
//       const result = await this.databaseService.getDataTable(query);

//       if (result.length > 0) {
//         const sum = result.reduce(
//           (total, row) => total + (parseInt(row.OEE) || 0),
//           0,
//         );
//         return (sum / result.length).toString();
//       }
//       return '0';
//     } catch (error) {
//       this.logger.error(`GetOEE failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getPackBrand(
//     oRequest: DTO.PackBrandRequest,
//   ): Promise<Interfaces.PackBrand> {
//     try {
//       const query = `sProc_GetPackBrand ${oRequest.LineID},'${oRequest.RunType}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: Interfaces.PackBrand = {
//         LineID: oRequest.LineID,
//         RunType: oRequest.RunType,
//         Brand: [],
//         Pack: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           // Brand data
//           if (result.recordsets[0]) {
//             result.recordsets[0].forEach((row: any) => {
//               response.Brand.push({
//                 BrandID: parseInt(row.BrandID) || 0,
//                 Brand: row.Brand || '',
//               });
//             });
//           }

//           // Pack data
//           if (result.recordsets[1]) {
//             result.recordsets[1].forEach((row: any) => {
//               response.Pack.push({
//                 PackID: parseInt(row.PackID) || 0,
//                 Pack: row.Pack || '',
//               });
//             });
//           }

//           response.ReturnCode = 0;
//           response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           response.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           response.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`GetPackBrand failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async initiateRun(oRequest: DTO.InitiateRun): Promise<DTO.InitiateRun> {
//     try {
//       if (
//         !oRequest.LineID ||
//         !oRequest.BrandID ||
//         !oRequest.PackID ||
//         !oRequest.RunStartTime
//       ) {
//         oRequest.ReturnCode = -3;
//         oRequest.ReturnMessage = 'Invalid request data.';
//         return oRequest;
//       }

//       const query = `sProc_InitiateRun @Pi_LineId=${oRequest.LineID},@Pi_BrandID=${oRequest.BrandID},@Pi_PackID=${oRequest.PackID},@Pv_DateTime='${oRequest.RunStartTime}',@PlanCase=${oRequest.PlanCase || 0}`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           const runData = result.recordsets[0];
//           if (runData.length > 0) {
//             oRequest.RunID = parseInt(runData[0].RunID) || 0;
//             oRequest.RunStartTime = runData[0].RunStartTime || '';
//             oRequest.ReturnCode = 0;
//             oRequest.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//           }
//         } else {
//           oRequest.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           oRequest.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return oRequest;
//     } catch (error) {
//       this.logger.error(`InitiateRun failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async terminateRun(oRequest: DTO.TerminateRun): Promise<DTO.TerminateRun> {
//     try {
//       let query = '';

//       if (!oRequest.RunEndTime) {
//         query = `EXEC sProc_TerminateRun @Pi_RunID=${oRequest.RunID},@EDatetIme=null,@Pv_StartTime='${oRequest.RunStartTime}',@PlanCase=${oRequest.PlanCase || 0}`;
//       } else {
//         query = `EXEC sProc_TerminateRun @Pi_RunID=${oRequest.RunID},@EDatetIme='${oRequest.RunEndTime}',@PlanCase=${oRequest.PlanCase || 0}`;
//       }

//       const result = await this.databaseService.executeStoredProcedure(query);

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           oRequest.ReturnCode = 0;
//           oRequest.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           oRequest.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           oRequest.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return oRequest;
//     } catch (error) {
//       this.logger.error(`TerminateRun failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async dashboard(
//     oRequest: DTO.DashboardRequest,
//   ): Promise<DTO.DashboardResponse> {
//     try {
//       const query = `sProc_Dashboard @Pi_RunID='${oRequest.RunID}',@Pi_LineID='${oRequest.LineID}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: DTO.DashboardResponse = {
//         LineID: oRequest.LineID,
//         RunDetail: {} as RunDetail, // or provide default values
//         CIPDetail: {} as CIPDetail, // or provide default values
//         TagDetail: [],
//         OEE: 0,
//         ReturnCode: -1,
//         ReturnMessage: 'Failed to load dashboard',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           // Process Run Details
//           if (result.recordsets[0] && result.recordsets[0].length > 0) {
//             response.RunDetail = this.createItemFromRow<DTO.RunDetail>(
//               result.recordsets[0][0],
//             );
//           }

//           // Process CIP Details
//           if (result.recordsets[1] && result.recordsets[1].length > 0) {
//             response.CIPDetail = this.createItemFromRow<DTO.CIPDetail>(
//               result.recordsets[1][0],
//             );
//           }

//           // Process Tag Details
//           if (result.recordsets[2] && result.recordsets[2].length > 0) {
//             const tagData = result.recordsets[2];
//             let num = 1;
//             const count = tagData.length;

//             for (const row of tagData) {
//               if (num === count) {
//                 // Last row - get additional data
//                 const meValues = await this.getMEValues(oRequest.LineID);
//                 const usleValues = await this.getUSLEValues(oRequest.LineID);
//                 const uslePers = await this.getUSLEPers(oRequest.LineID);

//                 const tagDetail: DTO.TagDetails = {
//                   TagID: parseInt(row.TagID) || 0,
//                   TagName: row.TagName || '',
//                   ButtonName: row.TagName || '',
//                   ButtonActiveColor: row.ButtonActiveColor || '',
//                   ButtonDeactiveColor: row.ButtonDeactiveColor || '',
//                   FontColor: row.FontColor || '',
//                   BPM: parseInt(row['Speed BPM']) || 0,
//                   StoppageCount: parseInt(row['Stoppage Count']) || 0,
//                   StoppageTime: row['Stoppage Time'] || '',
//                   StoppageCountLabel: row['Stoppage Count Label'] || '',
//                   StoppageTimeLabel: row['Stoppage Time Label'] || '',
//                   SpeedBMPLabel: row['Speed BPM Label'] || '',
//                   StartDateLabel: row['Start Date Label'] || '',
//                   StartDate: row['Start Date'] || '',
//                   Status: parseInt(row.Status) || 0,
//                   NotOperationStatus: parseInt(row.NotOperationStatus) || 0,
//                   MeValueDetail: meValues,
//                   UsleDetail: usleValues,
//                   USLEPers: uslePers,
//                 };
//                 response.TagDetail.push(tagDetail);
//               } else {
//                 const tagDetail: DTO.TagDetails = {
//                   TagID: parseInt(row.TagID) || 0,
//                   TagName: row.TagName || '',
//                   ButtonName: row.TagName || '',
//                   ButtonActiveColor: row.ButtonActiveColor || '',
//                   ButtonDeactiveColor: row.ButtonDeactiveColor || '',
//                   FontColor: row.FontColor || '',
//                   BPM: parseInt(row['Speed BPM']) || 0,
//                   StoppageCount: parseInt(row['Stoppage Count']) || 0,
//                   StoppageTime: row['Stoppage Time'] || '',
//                   StoppageCountLabel: row['Stoppage Count Label'] || '',
//                   StoppageTimeLabel: row['Stoppage Time Label'] || '',
//                   SpeedBMPLabel: row['Speed BPM Label'] || '',
//                   StartDateLabel: row['Start Date Label'] || '',
//                   StartDate: row['Start Date'] || '',
//                   Status: parseInt(row.Status) || 0,
//                   NotOperationStatus: parseInt(row.NotOperationStatus) || 0,
//                   MeValueDetail: [],
//                   UsleDetail: [],
//                   USLEPers: '',
//                 };
//                 response.TagDetail.push(tagDetail);
//               }
//               num++;
//             }
//           }

//           // Get OEE
//           const runDate = response.RunDetail?.RunStartTime
//             ? new Date(response.RunDetail.RunStartTime).toLocaleDateString(
//                 'en-US',
//                 {
//                   day: '2-digit',
//                   month: 'short',
//                   year: 'numeric',
//                 },
//               )
//             : new Date().toLocaleDateString('en-US', {
//                 day: '2-digit',
//                 month: 'short',
//                 year: 'numeric',
//               });

//           const oeeQuery = `EXEC sProc_GetOEEDetails @RunDT='${runDate}',@RunID=${response.RunDetail?.RunID || 0},@LineID=${oRequest.LineID}`;
//           const oeeResult = await this.databaseService.getDataTable(oeeQuery);

//           if (oeeResult.length > 0) {
//             response.OEE = parseInt(oeeResult[0].OEE) || 0;
//           }

//           response.ReturnCode = 0;
//           response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           response.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           response.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`Dashboard failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   private async getMEValues(lineID: number): Promise<DTO.MeValue[]> {
//     const meValues: DTO.MeValue[] = [];

//     try {
//       const shifts = ['A', 'B', 'C'];
//       for (const shift of shifts) {
//         const query = `sProc_MEPerByLineTodayCIP '1','${lineID}','${shift}'`;
//         const result = await this.databaseService.getDataTable(query);
//         if (result.length > 0) {
//           meValues.push({
//             Me: result[0].MEPer || '0',
//             Shift: shift,
//           });
//         }
//       }
//     } catch (error) {
//       this.logger.error(`GetMEValues failed: ${error.message}`);
//     }

//     return meValues;
//   }

//   private async getUSLEValues(lineID: number): Promise<DTO.USLEValue[]> {
//     const usleValues: DTO.USLEValue[] = [];

//     try {
//       const shifts = ['A', 'B', 'C'];
//       for (const shift of shifts) {
//         const query = `USLECIP '1','${lineID}','${shift}'`;
//         const result = await this.databaseService.getDataTable(query);
//         if (result.length > 0) {
//           usleValues.push({
//             USLE: result[0].MEPer || '0',
//             Shift: shift,
//           });
//         }
//       }
//     } catch (error) {
//       this.logger.error(`GetUSLEValues failed: ${error.message}`);
//     }

//     return usleValues;
//   }

//   private async getUSLEPers(lineID: number): Promise<string> {
//     try {
//       const query = `sProc_USLESPerByLineToday '${lineID}','1'`;
//       const result = await this.databaseService.getDataTable(query);
//       return result[0]?.Result || '';
//     } catch (error) {
//       this.logger.error(`GetUSLEPers failed: ${error.message}`);
//       return '';
//     }
//   }

//   async mePercetange(
//     request: DTO.MePercentageRequest,
//   ): Promise<Interfaces.MePercetangeResponse> {
//     try {
//       const response: Interfaces.MePercetangeResponse = {
//         MeValueDetail: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       const shifts = ['A', 'B', 'C'];
//       for (const shift of shifts) {
//         const query = `sProc_MEPerByLineTodayCIP '${request.TagId}','${request.LineId}','${shift}'`;
//         const result = await this.databaseService.getDataTable(query);
//         if (result.length > 0) {
//           response.MeValueDetail.push({
//             Me: result[0].MEPer || '0',
//             Shift: shift,
//           });
//         }
//       }

//       response.ReturnCode = 0;
//       response.ReturnMessage = 'Success';
//       return response;
//     } catch (error) {
//       this.logger.error(`MePercetange failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async localCPUStatus(): Promise<Interfaces.LocalCPUStatusResponse> {
//     try {
//       const query = 'sProc_LocalCPUStatus';
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.LocalCPUStatusResponse = {
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         response.ReturnCode = parseInt(result[0].ReturnCode) || 0;
//         response.ReturnMessage = result[0].RetunMessage || 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`LocalCPUStatus failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async downtime(
//     oRequest: DTO.DashboardRequest,
//   ): Promise<DTO.DowntimeResponse> {
//     try {
//       const query = `sProc_Downtime '${oRequest.RunID}','${oRequest.LineID}','${oRequest.UserID}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: DTO.DowntimeResponse = {
//         LineID: oRequest.LineID,
//         RunID: oRequest.RunID,
//         UserID: oRequest.UserID,
//         LineDowntime: [],
//         MachineDowntime: [],
//         MinorStoppage: [],
//         DTCount: { TotalLine: 0, TotalMachine: 0, TotalMinor: 0 },
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           // Line Downtime
//           if (result.recordsets[0]) {
//             result.recordsets[0].forEach((row: any) => {
//               response.LineDowntime.push({
//                 AssetName: row.TagName || '',
//                 ReasonAssetName: row.ReasonAsset || '',
//                 StartTime: row.StartTime || '',
//                 EndTime: row.EndTime || '',
//                 TimeLost: row.TimeLost || '',
//                 DTID: parseInt(row.DTID) || 0,
//                 Type: row.Type || '',
//               });
//             });
//           }

//           // Machine Downtime
//           if (result.recordsets[1]) {
//             result.recordsets[1].forEach((row: any) => {
//               response.MachineDowntime.push({
//                 AssetName: row.TagName || '',
//                 ReasonAssetName: row.ReasonAsset || '',
//                 StartTime: row.StartTime || '',
//                 EndTime: row.EndTime || '',
//                 TimeLost: row.TimeLost || '',
//                 DTID: parseInt(row.DTID) || 0,
//                 Type: row.Type || '',
//               });
//             });
//           }

//           // Minor Stoppage
//           if (result.recordsets[2]) {
//             result.recordsets[2].forEach((row: any) => {
//               response.MinorStoppage.push({
//                 AssetName: row.TagName || '',
//                 ReasonAssetName: row.ReasonAsset || '',
//                 StartTime: row.StartTime || '',
//                 EndTime: row.EndTime || '',
//                 TimeLost: row.TimeLost || '',
//                 DTID: parseInt(row.DTID) || 0,
//                 Type: row.Type || '',
//               });
//             });
//           }

//           // Counts
//           response.DTCount.TotalLine = response.LineDowntime.length;
//           response.DTCount.TotalMachine = response.MachineDowntime.length;
//           response.DTCount.TotalMinor = response.MinorStoppage.length;

//           response.ReturnCode = 0;
//           response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           response.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           response.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`Downtime failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getLossStructure(
//     oRequest: DTO.LosstructureResponse,
//   ): Promise<DTO.LossStructure> {
//     try {
//       let query = '';
//       if (oRequest.IsRejection === 0) {
//         query = `sProc_GetLossStructure @Pi_Line='${oRequest.LineID}'`;
//       } else {
//         query = `sProc_GetLossStructure @IsRejection=1,@Pi_Line='${oRequest.LineID}'`;
//       }

//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: DTO.LossStructure = {
//         LineID: oRequest.LineID,
//         LossStructureList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           if (result.recordsets[0]) {
//             result.recordsets[0].forEach((row: any) => {
//               response.LossStructureList.push({
//                 Id: parseInt(row.LossStructureID) || 0,
//                 Name: row.LossStructureName || '',
//               });
//             });
//           }
//           response.ReturnCode = 0;
//           response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           response.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           response.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetLossStructure failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getAssetByLossStructure(
//     oRequest: DTO.AssetResponse,
//   ): Promise<DTO.AssetByLossStructure> {
//     try {
//       const query = `sProc_GetAssetByLossStructure '${oRequest.LossStructureID}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: DTO.AssetByLossStructure = {
//         LossStructureID: oRequest.LossStructureID,
//         AssetList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           if (result.recordsets[0]) {
//             result.recordsets[0].forEach((row: any) => {
//               response.AssetList.push({
//                 Id: parseInt(row.AssetID) || 0,
//                 Name: row.AssetName || '',
//               });
//             });
//           }
//           response.ReturnCode = 0;
//           response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           response.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           response.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetAssetByLossStructure failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getComponentByAssetID(
//     oRequest: DTO.ComponentResponse,
//   ): Promise<DTO.ComponentByAsset> {
//     try {
//       const query = `sProc_GetComponentByAssetID '${oRequest.AssetID}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: DTO.ComponentByAsset = {
//         AssetID: oRequest.AssetID,
//         ComponentList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           if (result.recordsets[0]) {
//             result.recordsets[0].forEach((row: any) => {
//               response.ComponentList.push({
//                 Id: parseInt(row.ComponentID) || 0,
//                 Name: row.ComponentName || '',
//               });
//             });
//           }
//           response.ReturnCode = 0;
//           response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           response.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           response.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetComponentByAssetID failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getFailureByComponentID(
//     oRequest: DTO.FailureResponse,
//   ): Promise<DTO.FailureByComponentID> {
//     try {
//       const query = `sProc_GetFailureByComponentID '${oRequest.ComponentID}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: DTO.FailureByComponentID = {
//         ComponentID: oRequest.ComponentID,
//         FailureList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           if (result.recordsets[0]) {
//             result.recordsets[0].forEach((row: any) => {
//               response.FailureList.push({
//                 Id: parseInt(row.FailureID) || 0,
//                 Name: row.FailureName || '',
//               });
//             });
//           }
//           response.ReturnCode = 0;
//           response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           response.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           response.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetFailureByComponentID failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async updateDownTime(
//     oRequest: DTO.UpdateDownTime,
//   ): Promise<DTO.UpdateDownTime> {
//     try {
//       // Validation
//       if (oRequest.DTID === 0) {
//         oRequest.ReturnCode = -1;
//         oRequest.ReturnMessage = 'DTID Not Available';
//         return oRequest;
//       }
//       if (oRequest.LossStructureID === 0) {
//         oRequest.ReturnCode = -1;
//         oRequest.ReturnMessage = 'Loss Structure Not Available';
//         return oRequest;
//       }
//       if (oRequest.AssetID === 0) {
//         oRequest.ReturnCode = -1;
//         oRequest.ReturnMessage = 'Asset Not Available';
//         return oRequest;
//       }
//       if (oRequest.ComponentID === 0) {
//         oRequest.ReturnCode = -1;
//         oRequest.ReturnMessage = 'Component Not Available';
//         return oRequest;
//       }
//       if (oRequest.FailureID === 0) {
//         oRequest.ReturnCode = -1;
//         oRequest.ReturnMessage = 'Failure Not Available';
//         return oRequest;
//       }

//       const query = `sProc_UpdateDownTime '${oRequest.Type}','${oRequest.DTID}','${oRequest.AssetID}','${oRequest.ComponentID}','${oRequest.LossStructureID}','${oRequest.FailureID}','${oRequest.Remarks}','${oRequest.UserID}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           oRequest.ReturnCode = 0;
//           oRequest.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           oRequest.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           oRequest.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return oRequest;
//     } catch (error) {
//       this.logger.error(`UpdateDownTime failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async cipList(): Promise<DTO.CIPReason> {
//     try {
//       const query = 'EXEC sProc_cipList';
//       const result = await this.databaseService.getDataTable(query);

//       const response: DTO.CIPReason = {
//         List: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.List.push({
//             ID: parseInt(row.ID) || 0,
//             CIPReason: row.CIPReason || '',
//             StandardTime: parseInt(row.CIPMin) || 0,
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`CIPList failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async cipStart(
//     oRequest: DTO.CIPStartResponse,
//   ): Promise<DTO.CIPStartResponse> {
//     try {
//       const query = `sProc_StartCIP '${oRequest.LineId}','${oRequest.ReasonId}','${oRequest.UserId}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           oRequest.ReturnCode = 0;
//           oRequest.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           oRequest.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           oRequest.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return oRequest;
//     } catch (error) {
//       this.logger.error(`CIPStart failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async cipStop(oRequest: DTO.CIPStopResponse): Promise<DTO.CIPStopResponse> {
//     try {
//       const query = `sProc_StopCIP '${oRequest.LineId}','${oRequest.Remark}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           oRequest.ReturnCode = 0;
//           oRequest.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           oRequest.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           oRequest.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return oRequest;
//     } catch (error) {
//       this.logger.error(`CIPStop failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async dataEntryDetails(
//     oRequest: Interfaces.DataEntry,
//   ): Promise<Interfaces.DataEntry> {
//     try {
//       const query = `sProc_InsUpdDataEntry '${oRequest.MachineID}','${oRequest.Rework}','${oRequest.ReworkType}','${oRequest.Operator}','${oRequest.RunID}','${oRequest.ShiftID}'`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           oRequest.ReturnCode = 0;
//           oRequest.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           oRequest.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           oRequest.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return oRequest;
//     } catch (error) {
//       this.logger.error(
//         `DataEntryDetails failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getShiftMaster(): Promise<Interfaces.ShiftMasterResponse> {
//     try {
//       const query = 'EXEC sProc_GetShiftMaster';
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.ShiftMasterResponse = {
//         ShiftList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.ShiftList.push({
//             Id: parseInt(row.ID) || 0,
//             ShiftName: row.ShiftName || '',
//             ShiftFromTime: row.ShiftFromTime || '',
//             ShiftToTime: row.ShiftToTime || '',
//             AlertTimeInMin: parseInt(row.AlertTimeInMin) || 0,
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`GetShiftMaster failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async userDetailByShift(
//     oRequest: DTO.UserDetailByShiftRequest,
//   ): Promise<DTO.UserDetailByShift> {
//     try {
//       const query = `sProc_UserDetailByShift ${oRequest.LineId},${oRequest.ShiftID},${oRequest.TagID}`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: DTO.UserDetailByShift = {
//         UserID: 0,
//         DisplayName: '',
//         UserName: '',
//         Pin: '',
//         Password: '',
//         ShiftFromTime: '',
//         ShiftToTime: '',
//         AlertTimeInMin: 0,
//         TodayDate: '',
//         ShiftId: 0,
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         const row = result[0];
//         response.UserID = parseInt(row.UserID) || 0;
//         response.DisplayName = row.DisplayName || '';
//         response.UserName = row.UserName || '';
//         response.Pin = row.Pin || '';
//         response.Password = row.Password || '';
//         response.ShiftFromTime = row.ShiftFromTime || '';
//         response.ShiftToTime = row.ShiftToTime || '';
//         response.AlertTimeInMin = parseInt(row.AlertTimeInMin) || 0;
//         response.TodayDate = row.TodayDate || '';
//         response.ShiftId = parseInt(row.ShiftId) || 0;
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `UserDetailByShift failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async saveOperatorByShiftID(
//     oRequest: DTO.SaveOperatorByShiftIDRequest,
//   ): Promise<DTO.SaveOperatorByShiftIDresponse> {
//     try {
//       const query = `sProc_SaveOperatorByShiftID ${oRequest.LineId},${oRequest.TagID},${oRequest.ShiftID},${oRequest.UserID}`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: DTO.SaveOperatorByShiftIDresponse = {
//         UserLogID: 0,
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         response.UserLogID = parseInt(result[0].UserLogID) || 0;
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `SaveOperatorByShiftID failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async updateUserLoginTimeLog(
//     oRequest: DTO.SaveOperatorByShiftIDRequest,
//   ): Promise<DTO.SaveOperatorByShiftIDresponse> {
//     try {
//       const query = `sProc_SaveUserLoginTimeLog ${oRequest.LineId},${oRequest.TagID},${oRequest.ShiftID},${oRequest.UserID},${oRequest.UserLOGID || 0}`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: DTO.SaveOperatorByShiftIDresponse = {
//         UserLogID: 0,
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         response.UserLogID = parseInt(result[0].UserLogID) || 0;
//         response.ReturnCode = parseInt(result[0].Return_Code) || 0;
//         response.ReturnMessage = result[0].Return_Message || 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `UpdateUserLoginTimeLog failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async updateOperatorLogoutTime(
//     oRequest: DTO.UpdateOperatorLogoutTimeRequest,
//   ): Promise<DTO.UpdateOperatorLogoutTimeRequest> {
//     try {
//       const query = `sProc_UpdateOperatorLogoutTime ${oRequest.UserLogID}`;
//       const result = await this.databaseService.getDataTable(query);

//       if (result.length > 0) {
//         oRequest.ReturnCode = parseInt(result[0].Return_Code) || 0;
//         oRequest.ReturnMessage = result[0].Return_Message || 'Success';
//       }

//       return oRequest;
//     } catch (error) {
//       this.logger.error(
//         `UpdateOperatorLogoutTime failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getAllOperators(
//     oRequest: DTO.GetAllOperatorsRequest,
//   ): Promise<DTO.GetAllOperatorsResponse> {
//     try {
//       const query = `sProc_GetAllOperators ${oRequest.LineID},${oRequest.TagID}`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: DTO.GetAllOperatorsResponse = {
//         OperatorList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.OperatorList.push({
//             UserID: parseInt(row.UserID) || 0,
//             DisplayName: row.DisplayName || '',
//             UserName: row.UserName || '',
//             Pin: row.Pin || '',
//             Password: row.Password || '',
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetAllOperators failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async reworkMaster(): Promise<Interfaces.ReworkTypeResponse> {
//     try {
//       const query = 'select * from tbl_ReworkMaster where isActive = 1';
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.ReworkTypeResponse = {
//         ReworkList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.ReworkList.push({
//             ID: parseInt(row.ID) || 0,
//             ReworkType: row.ReworkType || '',
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`ReworkMaster failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getNotification(
//     notificationRequest: DTO.NotificationRequest,
//   ): Promise<DTO.Notification> {
//     try {
//       const query = `getDetailForNotification ${notificationRequest.LineID}`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: DTO.Notification = {
//         ReturnCode: '-1',
//         ReturnMessage: 'Failed',
//         checkForNotificationsList: [],
//       };

//       if (result && result.recordsets && result.recordsets.length > 1) {
//         const messageTable = result.recordsets[1];
//         if (messageTable.length > 0 && messageTable[0].message === '1') {
//           const notificationData = result.recordsets[0];
//           notificationData.forEach((row: any) => {
//             response.checkForNotificationsList.push({
//               TagName: row.tagname || '',
//               StartTime: row.starttime || '',
//               TotalLoss: row.totalloss || '',
//             });
//           });
//         }
//         response.ReturnCode = '0';
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetNotification failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getAppDashboardBD(
//     oRequest: Interfaces.DashboardBDRequest,
//   ): Promise<Interfaces.DashboardBDResponse> {
//     try {
//       const query = `sProc_AppDashboardBD ${oRequest.LineID},${oRequest.TagID}`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.DashboardBDResponse = {
//         List: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.List.push({
//             Hour: parseInt(row.Hour) || 0,
//             Day: parseInt(row.Day) || 0,
//             Value: parseInt(row.value) || 0,
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetAppDashboardBD failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async startTimeUserName(
//     oRequest: Interfaces.StartTimeByUserNameRequest,
//   ): Promise<Interfaces.StartTimeByUserName> {
//     try {
//       const query = `sProc_GetStartTimeUserName ${oRequest.LineID},${oRequest.UserID},${oRequest.ShiftID}`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.StartTimeByUserName = {
//         List: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.List.push({
//             RunStartTime: row.RunStartTime || '',
//             Status: parseInt(row.Status) || 0,
//             UserName: row.UserName || '',
//             LogID: parseInt(row.LogID) || 0,
//             UserID: parseInt(row.UserID) || 0,
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `StartTimeUserName failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async updateAssetStatus(
//     oRequest: Interfaces.UpdateAssetStatusRequest,
//   ): Promise<Interfaces.AssetStatus> {
//     try {
//       const query = `sProc_UpdateAssetStatus ${oRequest.Status},${oRequest.TagID}`;
//       const result = await this.databaseService.executeStoredProcedure(query);

//       const response: Interfaces.AssetStatus = {
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result && result.recordsets && result.recordsets.length > 0) {
//         const lastTable = result.recordsets[result.recordsets.length - 1];
//         if (lastTable.length > 0 && lastTable[0].Return_Code === '0') {
//           response.ReturnCode = 0;
//           response.ReturnMessage = lastTable[0].Return_MESSAGE || 'Success';
//         } else {
//           response.ReturnCode = parseInt(lastTable[0]?.Return_Code) || -1;
//           response.ReturnMessage = lastTable[0]?.Return_MESSAGE || 'Failed';
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `UpdateAssetStatus failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getFireBaseNotification(
//     notificationRequest: DTO.NotificationRequest,
//   ): Promise<DTO.Notification> {
//     try {
//       // Similar to getNotification but with additional Firebase logic
//       const notification = await this.getNotification(notificationRequest);

//       if (notification.checkForNotificationsList.length > 0) {
//         // Firebase logic would go here
//         // This would require additional Firebase setup
//       }

//       return notification;
//     } catch (error) {
//       this.logger.error(
//         `GetFireBaseNotification failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getDeviceCaptureResponseLogin(
//     oRequest: DTO.LoginRequest,
//   ): Promise<DTO.LoginResponse> {
//     try {
//       const query = `select * from tbl_userMaster where username ='${oRequest.username}' and Ldap =1`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: DTO.LoginResponse = {
//         username: oRequest.username,
//         password: '****',
//         ReturnCode: -1,
//         ReturnMessage: 'User Id or/and Password Incorrect!!',
//       };

//       if (result.length > 0) {
//         if (oRequest.DeviceTokenId) {
//           const userID = await this.databaseService.executeScalar(
//             `select isnull(UserId,0) as UserId from tbl_userMaster where username ='${oRequest.username}'`,
//           );

//           await this.databaseService.executeNonQuery(
//             `edts_Manage_Device '${userID}','${oRequest.DeviceTokenId}','${oRequest.DeviceID}'`,
//           );

//           await this.databaseService.executeNonQuery(
//             `Update tbl_UserMaster set DeviceID='${oRequest.DeviceID}' where userName='${oRequest.username}'`,
//           );

//           await this.databaseService.executeNonQuery(
//             `Update tbl_FirebaseToken_User set FirebaseTokenId='${oRequest.DeviceTokenId}' where UserId=${userID}`,
//           );
//         }

//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetDeviceCaptureResponseLogin failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getDeviceCaptureOnLogut(
//     request: DTO.DeviceCaptureRequest,
//   ): Promise<DTO.DeviceCaptureResponse> {
//     try {
//       const response: DTO.DeviceCaptureResponse = {
//         ReturnCode: -1,
//         ReturnMessage: 'User Id Or Device Id is Empty',
//       };

//       if (request.UserId && request.DeviceId) {
//         await this.databaseService.executeNonQuery(
//           `sproc_Manage_Device '${request.SpType}','${request.DeviceId}','${request.UserId}','${request.LineId || 0}'`,
//         );
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetDeviceCaptureOnLogut failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getShiftDataResponse(
//     request: Interfaces.ShiftDataRequest,
//   ): Promise<Interfaces.ShiftDataResponse> {
//     try {
//       const query = `sProc_ShiftData '${request.TagId}','${request.LineId}'`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.ShiftDataResponse = {
//         shiftDataList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.shiftDataList.push({
//             Brand: row.Brand || '',
//             Date_Time: row.DateTime || '',
//             RunStartTime: row.RunStartTime || '',
//             ME: row.ME || '',
//             Pack: row.Pack || '',
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetShiftDataResponse failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async updateRemarksCIP(
//     request: DTO.CIPUpdateRequest,
//   ): Promise<DTO.CIPUpdateResponse> {
//     try {
//       await this.databaseService.executeNonQuery(
//         `sProc_Update_Remarks_CIP '${request.CIPID}','${request.LineId}','${request.UserId}','${request.Remarks}'`,
//       );

//       const response: DTO.CIPUpdateResponse = {
//         ReturnCode: 0,
//         ReturnMessage: 'Success',
//       };

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `UpdateRemarksCIP failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async downtimehistory(
//     orequest: DTO.DowntimeHistoryRequest,
//   ): Promise<DTO.DowntimeHistoryResponse> {
//     try {
//       const query = `sproc_downtimehistory '${orequest.FromDate}','${orequest.ToDate}'`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: DTO.DowntimeHistoryResponse = {
//         DowntimeList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.DowntimeList.push({
//             StartTime: row.starttime || '',
//             EndTime: row.starttime || '', // Note: This seems to be a bug in the original code
//             ReasonAsset: row.reasonasset || '',
//             TimeLost: row.timelost || '',
//             Remark: row.OperatorRemark || '',
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       } else {
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'No Data';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `Downtimehistory failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async uslePerByLineToday(
//     orequest: Interfaces.USLERequest,
//   ): Promise<Interfaces.USLEResponse> {
//     try {
//       const query = `sProc_USLEPerByLineToday '${orequest.LineID}','${orequest.TagID}'`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.USLEResponse = {
//         Usle: 0,
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         response.Usle = parseInt(result[0][0] || '0');
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       } else {
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'No Data';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `USLEPerByLineToday failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getShiftHourlyDataResponse(
//     request: Interfaces.ShiftDataRequest,
//   ): Promise<Interfaces.ShiftDataResponse> {
//     try {
//       const query = `sProc_HourlyData '${request.TagId}','${request.LineId}'`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.ShiftDataResponse = {
//         shiftDataList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.shiftDataList.push({
//             Brand: row.Brand || '',
//             Date_Time: row.DateTime || '',
//             RunStartTime: row.RunStartTime || '',
//             ME: row['ME%'] || '',
//             Pack: row.Pack || '',
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetShiftHourlyDataResponse failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async checkUrl(objUrl: Interfaces.CheckUrl): Promise<Interfaces.CheckUrl> {
//     try {
//       objUrl.ReturnCode = 0;
//       objUrl.ReturnMessage = 'Success';
//       return objUrl;
//     } catch (error) {
//       this.logger.error(`CheckUrl failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async managerLogin(
//     password: string,
//     oRequest: DTO.LoginRequest,
//   ): Promise<DTO.LoginResponse> {
//     try {
//       const query = `select * from tbl_userMaster where username ='${oRequest.username}' and Ldap =1`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: DTO.LoginResponse = {
//         username: oRequest.username,
//         password: '****',
//         ReturnCode: -1,
//         ReturnMessage: 'User Id or/and Password Incorrect!!',
//       };

//       if (result.length > 0) {
//         // LDAP authentication would go here
//         // For now, we'll simulate successful authentication
//         response.ReturnCode = 0;
//         response.ReturnMessage = '';

//         if (oRequest.DeviceID) {
//           const userID = await this.databaseService.executeScalar(
//             `select isnull(UserId,0) as UserId from tbl_userMaster where username ='${oRequest.username}'`,
//           );

//           if (oRequest.DeviceTokenId) {
//             await this.databaseService.executeNonQuery(
//               `edts_Manage_Device '${userID}','${oRequest.DeviceTokenId}','${oRequest.DeviceID}'`,
//             );
//           }

//           await this.databaseService.executeNonQuery(
//             `Update tbl_UserMaster set DeviceID='${oRequest.DeviceID}' where userName='${oRequest.username}'`,
//           );

//           if (oRequest.DeviceTokenId) {
//             await this.databaseService.executeNonQuery(
//               `Update tbl_FirebaseToken_User set FirebaseTokenId='${oRequest.DeviceTokenId}' where UserId=${userID}`,
//             );
//           }
//         }
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`ManagerLogin failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getLineList(): Promise<Interfaces.LineResponse> {
//     try {
//       const response: Interfaces.LineResponse = {
//         LineList: [
//           {
//             FILLER: '00',
//             SLEPercentage: '00',
//             SLEPercentageLABEL: '00',
//             SKU: '00',
//             LINE: 7,
//             CASES: '00',
//             CASESLABEL: '00',
//             StartRunTime: '00',
//           },
//         ],
//         ReturnCode: 0,
//         ReturnMessage: 'Success',
//       };

//       return response;
//     } catch (error) {
//       this.logger.error(`GetLineList failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getDashboardIOS(
//     oRequest: Interfaces.GetDashboardRequest,
//   ): Promise<Interfaces.GetDashboardResponse> {
//     try {
//       const response: Interfaces.GetDashboardResponse = {
//         ME: 0,
//         LossList: [],
//         MeList: [],
//         USLE: 0,
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       // Get ME Percentage
//       const meQuery = `sProc_MEPerByLineToday '${oRequest.LineID}','${oRequest.TagID}'`;
//       const meResult = await this.databaseService.getDataTable(meQuery);
//       if (meResult.length > 0) {
//         response.ME = parseInt(meResult[0][0]) || 0;
//       }

//       // Get Loss Percentage
//       const lossQuery = `sProc_LossPercentageByLossName '${oRequest.LineID}'`;
//       const lossResult = await this.databaseService.getDataTable(lossQuery);
//       if (lossResult.length > 0) {
//         const colors = [
//           '#3e95cd',
//           '#8e5ea2',
//           '#3cba9f',
//           '#e8c3b9',
//           '#00FF00',
//           '#008000',
//           '#00FFFF',
//           '#3cba9f',
//           '#008080',
//           '#0000FF',
//           '#FF00FF',
//           '#800080',
//           '#BDB76B',
//           '#9370DB',
//           '#6A5ACD',
//           '#98FB98',
//           '#006400',
//         ];

//         let index = 0;
//         lossResult.forEach((row: any) => {
//           response.LossList.push({
//             Name: row.Name || '',
//             Time: row.Time || '',
//             ColorCode: colors[index % colors.length],
//           });
//           index++;
//         });
//       }

//       // Get ME List
//       const meListQuery = `sProc_MePerByLine '${oRequest.LineID}','${oRequest.TagID}'`;
//       const meListResult = await this.databaseService.getDataTable(meListQuery);
//       if (meListResult.length > 0) {
//         meListResult.forEach((row: any) => {
//           response.MeList.push({
//             Hour: parseInt(row.Hour) || 0,
//             MEPer: parseInt(row.MePer) || 0,
//           });
//         });
//       }

//       // Get USLE
//       const usleQuery = `sProc_USLESPerByLineToday '${oRequest.LineID}','${oRequest.TagID}'`;
//       const usleResult = await this.databaseService.getDataTable(usleQuery);
//       if (usleResult.length > 0) {
//         response.USLE = parseInt(usleResult[0].Result) || 0;
//       }

//       response.ReturnCode = 0;
//       response.ReturnMessage = 'Success';

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetDashboardIOS failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getLineResponse(): Promise<Interfaces.GetLineListResponse> {
//     try {
//       const query = "sproc_managerLinesInfo ' '";
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.GetLineListResponse = {
//         LineList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.LineList.push({
//             RunID: row.RunID || '',
//             BrandName: row.BrandName || '',
//             CaseCount: row.CaseCount || '',
//             FillerSpeed: row.fillerSpeed || '',
//             LineId: row.LineId || '',
//             ME: row.ME || '',
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetLineResponse failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getLineResponseDownTime(
//     request: Interfaces.DownTimeRequest,
//   ): Promise<Interfaces.DownTimeResponse> {
//     try {
//       const query = `sp_DownTimeReport '${request.UserName}','${request.FromDate}','${request.ToDate}'`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.DownTimeResponse = {
//         DownTimeList: [],
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.DownTimeList.push({
//             AssetName: row.AssetName || '',
//             FailureName: row.FailureName || '',
//             StartTime: row.StartTime || '',
//             TimeLoss: row.TimeLoss || '',
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetLineResponseDownTime failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async pushNotification(
//     request: DTO.PushNotificationRequest,
//   ): Promise<DTO.PushNotificationResponse> {
//     try {
//       const query = `Update tbl_UserMaster set TokenID='${request.tokenID}' where DeviceID='${request.deviceID}'; select * from tbl_UserMaster where TokenID='${request.tokenID}' and DeviceID='${request.deviceID}'`;
//       const result = await this.databaseService.getDataTable(query);

//       const response: DTO.PushNotificationResponse = {
//         ReturnCode: -1,
//         ReturnMessage: 'Some error during token updation!',
//       };

//       if (result.length > 0) {
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `PushNotification failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async insertUpRejection(
//     oRequest: Interfaces.RejectionRequest,
//   ): Promise<Interfaces.RejectionRequest> {
//     try {
//       let query = '';
//       if (!oRequest.RejectionID || oRequest.RejectionID === 0) {
//         query = `insert into tbl_RejectionDetails(TagID,LossStructureID,AssetID,BrandID,PackID,RejectionCount,RejectionDate,LineID,DOE) values(${oRequest.TagID},${oRequest.LossStructureID},${oRequest.AssetID},${oRequest.BrandID},${oRequest.PackID},${oRequest.RejectionLoss},'${new Date(oRequest.RejectionDate).toISOString()}',${oRequest.LineID},getdate())`;
//       } else {
//         query = `UPDATE [dbo].[tbl_RejectionDetails] SET [TagID] =${oRequest.TagID},[LossStructureID] =${oRequest.LossStructureID},[AssetID] =${oRequest.AssetID},[BrandID] =${oRequest.BrandID},[PackID] =${oRequest.PackID},[RejectionCount] =${oRequest.RejectionLoss},[RejectionDate] ='${new Date(oRequest.RejectionDate).toISOString()}',[LineID] =${oRequest.LineID} WHERE ID=${oRequest.RejectionID}`;
//       }

//       await this.databaseService.executeNonQuery(query);

//       oRequest.ReturnCode = 0;
//       oRequest.ReturnMessage = 'Success';
//       return oRequest;
//     } catch (error) {
//       this.logger.error(
//         `InsertUpRejection failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getRejection(
//     oRequest: Interfaces.RejectionResponse,
//   ): Promise<Interfaces.RejectionResponse> {
//     try {
//       const query = `select T1.*,convert(varchar, T1.RejectionDate, 113) as [ReDate],line.LineName,tag.TagName,loss.LossStructureName,ass.AssetName,brand.BrandName,pk.PackName from tbl_RejectionDetails T1
//                      left join tbl_LineMaster line on T1.LineID = line.LineID
//                      left join tbl_TagMaster tag on T1.TagID = tag.TagID
//                      left join tbl_LossStructureMaster loss on T1.LossStructureID = loss.LossStructureID
//                      left join tbl_AssetMaster ass on T1.AssetID = ass.AssetID
//                      left join tbl_BrandMaster brand on T1.BrandID = brand.BrandID
//                      left join tbl_PackMaster pk on T1.PackID = pk.PackID
//                      where convert(date, T1.RejectionDate) between '${new Date(oRequest.StartDateTime).toISOString()}' and '${new Date(oRequest.EndDateTime).toISOString()}' order by T1.RejectionDate desc`;

//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.RejectionResponse = {
//         rejection: [],
//         StartDateTime: oRequest.StartDateTime,
//         EndDateTime: oRequest.EndDateTime,
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.rejection.push({
//             RejectionID: parseInt(row.ID) || 0,
//             Tagname: row.TagName || '',
//             LineName: row.LineName || '',
//             AssetName: row.AssetName || '',
//             BrandName: row.BrandName || '',
//             PackName: row.PackName || '',
//             LossStructureName: row.LossStructureName || '',
//             RejectionLoss: parseInt(row.RejectionCount) || 0,
//             RejectionDate: row.ReDate || '',
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(`GetRejection failed: ${error.message}`, error.stack);
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   async getRejectionByID(
//     rejectionID: string,
//   ): Promise<Interfaces.RejectionResponse> {
//     try {
//       const query = `select T1.*,convert(varchar, T1.RejectionDate, 113) as [ReDate],line.LineName,tag.TagName,loss.LossStructureName,ass.AssetName,brand.BrandName,pk.PackName from tbl_RejectionDetails T1
//                      left join tbl_LineMaster line on T1.LineID = line.LineID
//                      left join tbl_TagMaster tag on T1.TagID = tag.TagID
//                      left join tbl_LossStructureMaster loss on T1.LossStructureID = loss.LossStructureID
//                      left join tbl_AssetMaster ass on T1.AssetID = ass.AssetID
//                      left join tbl_BrandMaster brand on T1.BrandID = brand.BrandID
//                      left join tbl_PackMaster pk on T1.PackID = pk.PackID
//                      where ID=${rejectionID}`;

//       const result = await this.databaseService.getDataTable(query);

//       const response: Interfaces.RejectionResponse = {
//         rejection: [],
//         StartDateTime: '',
//         EndDateTime: '',
//         ReturnCode: -1,
//         ReturnMessage: 'Failed',
//       };

//       if (result.length > 0) {
//         result.forEach((row: any) => {
//           response.rejection.push({
//             RejectionID: parseInt(row.ID) || 0,
//             Tagname: row.TagName || '',
//             LineName: row.LineName || '',
//             AssetName: row.AssetName || '',
//             BrandName: row.BrandName || '',
//             PackName: row.PackName || '',
//             LossStructureName: row.LossStructureName || '',
//             RejectionLoss: parseInt(row.RejectionCount) || 0,
//             RejectionDate: row.ReDate || '',
//           });
//         });
//         response.ReturnCode = 0;
//         response.ReturnMessage = 'Success';
//       }

//       return response;
//     } catch (error) {
//       this.logger.error(
//         `GetRejectionByID failed: ${error.message}`,
//         error.stack,
//       );
//       throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
//     }
//   }

//   private createItemFromRow<T>(row: any): T {
//     const item = {} as T;
//     for (const key in row) {
//       if (
//         row.hasOwnProperty(key) &&
//         row[key] !== null &&
//         row[key] !== undefined
//       ) {
//         (item as any)[key] = row[key];
//       }
//     }
//     return item;
//   }

//   private apiKeys(
//     api: string,
//     userID: string,
//     lineID: number,
//     runID: number,
//   ): any {
//     let obj: any = null;

//     switch (api) {
//       case 'AppStart':
//         obj = { UserID: userID };
//         break;
//       case 'Dashboard':
//       case 'Downtime':
//         obj = { LineID: lineID, RunID: runID };
//         break;
//       case 'RunStart':
//         obj = { LineID: lineID };
//         break;
//       case 'CIPStart':
//         obj = { LineId: lineID };
//         break;
//       case 'DataEntry':
//         obj = { RunID: runID };
//         break;
//       default:
//         obj = null;
//     }

//     return obj;
//   }

//   // Note: Firebase notification sending would require additional setup
//   private async sendNotification(
//     deviceTokens: string[],
//     title: string,
//     body: string,
//     data: any,
//   ): Promise<void> {
//     // This would require Firebase Admin SDK setup
//     // Implementation would depend on your Firebase configuration
//     this.logger.log(
//       `Would send notification to ${deviceTokens.length} devices: ${title} - ${body}`,
//     );
//   }
// }
