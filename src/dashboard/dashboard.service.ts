// dashboard.service.ts
import { Injectable } from '@nestjs/common';
import * as sql from 'mssql';
import { sqlConnection } from '../env';

@Injectable()
export class DashboardService {
  private pool: sql.ConnectionPool;
  private sqlConnection = sqlConnection;

  constructor() {
    this.pool = new sql.ConnectionPool(sqlConnection);
  }

  async getMainDashboardData(lineID: number) {
    try {
      await sql.connect(this.sqlConnection);
      console.log('Connected to SQL Server for dashboard data');
      
      const request = new sql.Request();
      request.input('LineID', sql.Int, lineID);
      
      const result = await request.execute('sProc_GetDashBoardRecord');
      const recordsets = result.recordsets;
      console.log("recordsets_getMainDashboardData", recordsets);
      
      await this.pool.close();
      console.log('Main dashboard data retrieved successfully');
      
      return {
        success: true,
        data: {
          tableData: recordsets[0] || [], // Main table data
          // Add any other data from additional recordsets if needed
        },
        message: 'Dashboard data retrieved successfully'
      };
    } catch (error) {
      console.error('Error executing sProc_GetDashBoardRecord:', error);
      throw new Error(`Failed to fetch dashboard data: ${error.message}`);
    }
  }

  // async getMeChartData(lineID: number) {
  //   try {
  //     await sql.connect(this.sqlConnection);
  //     console.log('Connected to SQL Server for ME chart data');
      
  //     const request = new sql.Request();
  //     request.input('Pi_LineID', sql.Int, lineID);
  //     request.input('Pi_TagID', sql.Int, 1); // Based on your ASP.NET code
      
  //     const result = await request.execute('sProc_MePerByLine');
  //     const recordsets = result.recordsets;
  //     console.log('recordsets getMeChartData:', recordsets);
  //     await this.pool.close();
      
  //     // Process data similar to ASP.NET BindChart method
  //     const chartData:any = {
  //       labels: [],
  //       values: [],
  //       colors: []
  //     };
      
  //     if (recordsets[0] && recordsets[0].length > 0) {
  //       recordsets[0].forEach(row => {
  //         const label = row[0]?.toString() || '';
  //         const value = parseFloat(row[1]) || 0;
          
  //         chartData.labels.push(label);
  //         chartData.values.push(value);
          
  //         // Determine color based on value (matching ASP.NET logic)
  //         let color = '#FF0000'; // Red (default)
  //         if (value >= 80) {
  //           color = '#008000'; // Green
  //         } else if (value >= 70) {
  //           color = '#0000FF'; // Blue
  //         }
  //         chartData.colors.push(color);
  //       });
  //     }
      
  //     return {
  //       success: true,
  //       data: chartData,
  //       message: 'ME chart data retrieved successfully'
  //     };
  //   } catch (error) {
  //     console.error('Error executing sProc_MePerByLine:', error);
  //     throw new Error(`Failed to fetch ME chart data: ${error.message}`);
  //   }
  // }

  // dashboard.service.ts - Updated getMeChartData method
async getMeChartData(lineID: number) {
  try {
    await sql.connect(this.sqlConnection);
    console.log('Connected to SQL Server for ME chart data');
    
    const request = new sql.Request();
    request.input('Pi_LineID', sql.Int, lineID);
    request.input('Pi_TagID', sql.Int, 1); // Based on your ASP.NET code
    
    const result = await request.execute('sProc_MePerByLine');
    const recordsets = result.recordsets;
    
    console.log("recordsets_getMeChartData", recordsets);
    
    await this.pool.close();
    
    // Process data similar to ASP.NET BindChart method
    const chartData = {
      labels: [] as string[],
      values: [] as number[],
      colors: [] as string[]
    };
    
    if (recordsets[0] && recordsets[0].length > 0) {
      recordsets[0].forEach((row: any) => {
        // Extract data based on actual column names
        let label = '';
        let value = 0;
        
        // Check for Hour column (from your console log)
        if (row.Hour !== undefined) {
          label = `Hour ${row.Hour}`;
          value = parseFloat(row.MEPer) || 0;
        }
        // If column names are different
        else if (row[0] !== undefined && row[1] !== undefined) {
          label = row[0]?.toString() || '';
          value = parseFloat(row[1]) || 0;
        }
        // If object has properties but unknown names
        else {
          const keys = Object.keys(row);
          if (keys.length >= 2) {
            label = row[keys[0]]?.toString() || '';
            value = parseFloat(row[keys[1]]) || 0;
          }
        }
        
        chartData.labels.push(label);
        chartData.values.push(value);
        
        // Determine color based on value (matching ASP.NET logic)
        let color = '#FF0000'; // Red (default)
        if (value >= 80) {
          color = '#008000'; // Green
        } else if (value >= 70) {
          color = '#0000FF'; // Blue
        }
        chartData.colors.push(color);
      });
    }
    
    console.log('Processed ME Chart Data:', chartData);
    
    return {
      success: true,
      data: chartData,
      message: 'ME chart data retrieved successfully'
    };
  } catch (error) {
    console.error('Error executing sProc_MePerByLine:', error);
    throw new Error(`Failed to fetch ME chart data: ${error.message}`);
  }
}

  async getLossChartData(lineID: number) {
    try {
      await sql.connect(this.sqlConnection);
      console.log('Connected to SQL Server for loss chart data');
      
      const request = new sql.Request();
      request.input('Pi_LineID', sql.Int, lineID);
      
      const result = await request.execute('sProc_LossPercentageByLossName');
      const recordsets = result.recordsets;
      
      console.log("recordsets_getLossChartData", recordsets);

      await this.pool.close();
      
      // Process data for pie chart
      const lossData:any = {
        labels: [],
        values: [],
        rawData: recordsets[0] || []
      };
      
      if (recordsets[0] && recordsets[0].length > 0) {
        recordsets[0].forEach(item => {
          lossData.labels.push(item.Name || 'Unknown');
          lossData.values.push(parseFloat(item.Time) || 0);
        });
      } else {
        // Default data when no loss
        lossData.labels = ['No Loss'];
        lossData.values = [0];
      }
      
      return {
        success: true,
        data: lossData,
        message: 'Loss chart data retrieved successfully'
      };
    } catch (error) {
      console.error('Error executing sProc_LossPercentageByLossName:', error);
      throw new Error(`Failed to fetch loss chart data: ${error.message}`);
    }
  }

  // async getMePercentageToday(lineID: number) {
  //   try {
  //     await sql.connect(this.sqlConnection);
  //     console.log('Connected to SQL Server for ME percentage today');
      
  //     const request = new sql.Request();
  //     request.input('Pi_LineID', sql.Int, lineID);
  //     request.input('Pi_TagID', sql.Int, 1); // Based on your ASP.NET code
      
  //     const result = await request.execute('sProc_MEPerByLineToday');
  //     const recordsets = result.recordsets;
      
  //     await this.pool.close();
      
  //     let mePercentage = 0;
  //     let colorCode = '#FF0000'; // Default red
      
  //     if (recordsets[0] && recordsets[0].length > 0 && recordsets[0][0][0]) {
  //       mePercentage = parseInt(recordsets[0][0][0]) || 0;
        
  //       // Determine color based on value (matching ASP.NET logic)
  //       if (mePercentage >= 0 && mePercentage < 70) {
  //         colorCode = '#FF0000'; // Red
  //       } else if (mePercentage >= 70 && mePercentage < 80) {
  //         colorCode = '#0000FF'; // Blue
  //       } else if (mePercentage >= 80) {
  //         colorCode = '#008000'; // Green
  //       }
  //     }
      
  //     return {
  //       success: true,
  //       data: {
  //         percentage: mePercentage,
  //         colorCode: colorCode,
  //         rawData: recordsets[0] || []
  //       },
  //       message: 'ME percentage today retrieved successfully'
  //     };
  //   } catch (error) {
  //     console.error('Error executing sProc_MEPerByLineToday:', error);
  //     throw new Error(`Failed to fetch ME percentage today: ${error.message}`);
  //   }
  // }

  // dashboard.service.ts - Updated getMePercentageToday method
async getMePercentageToday(lineID: number) {
  try {
    await sql.connect(this.sqlConnection);
    console.log('Connected to SQL Server for ME percentage today');
    
    const request = new sql.Request();
    request.input('Pi_LineID', sql.Int, lineID);
    request.input('Pi_TagID', sql.Int, 1); // Based on your ASP.NET code
    
    const result = await request.execute('sProc_MEPerByLineToday');
    const recordsets = result.recordsets;
    
    console.log("recordsets_getMePercentageToday", recordsets);

    console.log('ME Percentage Today raw data:', JSON.stringify(recordsets, null, 2));
    
    await this.pool.close();
    
    let mePercentage = 0;
    let colorCode = '#FF0000'; // Default red
    
    if (recordsets[0] && recordsets[0].length > 0) {
      // Check different possible data structures
      const row = recordsets[0][0];
      
      // Method 1: If data is like { "": 45 }
      if (row && typeof row === 'object') {
        // Get the first property value
        const keys = Object.keys(row);
        if (keys.length > 0) {
          const firstKey = keys[0];
          mePercentage = parseFloat(row[firstKey]) || 0;
        }
      }
      
      // Method 2: If data is in first column
      if (mePercentage === 0 && row && row[0] !== undefined) {
        mePercentage = parseFloat(row[0]) || 0;
      }
      
      // Method 3: Try to find MEPer column
      if (mePercentage === 0 && row && row.MEPer !== undefined) {
        mePercentage = parseFloat(row.MEPer) || 0;
      }
      
      // Determine color based on value (matching ASP.NET logic)
      if (mePercentage >= 80) {
        colorCode = '#008000'; // Green
      } else if (mePercentage >= 70) {
        colorCode = '#0000FF'; // Blue
      }
    }
    
    console.log('Processed ME Percentage:', mePercentage, 'Color:', colorCode);
    
    return {
      success: true,
      data: {
        percentage: mePercentage,
        colorCode: colorCode,
        rawData: recordsets[0] || []
      },
      message: 'ME percentage today retrieved successfully'
    };
  } catch (error) {
    console.error('Error executing sProc_MEPerByLineToday:', error);
    throw new Error(`Failed to fetch ME percentage today: ${error.message}`);
  }
}

  // async getDashboardHeading(lineID: number) {
  //   try {
  //     await sql.connect(this.sqlConnection);
  //     console.log('Connected to SQL Server for dashboard heading');
      
  //     const request = new sql.Request();
  //     request.input('Pi_LineID', sql.Int, lineID);
      
  //     const result = await request.execute('SProc_GetDashboardHeadingDetails');
  //     const recordsets = result.recordsets;
      
  //     await this.pool.close();
      
  //     // Process the heading data
  //     let headingData = {
  //       lineName: '',
  //       sku: '',
  //       startTime: '',
  //       duration: ''
  //     };
  //     console.log("recordsets", recordsets);
      
  //     if (recordsets[0] && recordsets[0].length > 0) {
  //       const row = recordsets[0][0];
  //       headingData = {
  //         lineName: row.LineName || '',
  //         sku: row.SKU || '',
  //         startTime: row.StartTime ? new Date(row.StartTime).toLocaleString() : '',
  //         duration: row.Duration || ''
  //       };
  //     }
      
  //     return {
  //       success: true,
  //       data: headingData,
  //       message: 'Dashboard heading retrieved successfully'
  //     };
  //   } catch (error) {
  //     console.error('Error executing SProc_GetDashboardHeadingDetails:', error);
  //     throw new Error(`Failed to fetch dashboard heading: ${error.message}`);
  //   }
  // }

  // dashboard.service.ts - Updated getDashboardHeading method
// dashboard.service.ts - Updated getDashboardHeading method with MINUTES conversion
async getDashboardHeading(lineID: number) {
  try {
    await sql.connect(this.sqlConnection);
    console.log('Connected to SQL Server for dashboard heading');
    
    const request = new sql.Request();
    request.input('Pi_LineID', sql.Int, lineID);
    
    const result = await request.execute('SProc_GetDashboardHeadingDetails');
    const recordsets = result.recordsets;
    
       console.log("recordsets_getDashboardHeading", recordsets);

    await this.pool.close();
        
    // Process the heading data based on your actual data structure
    let headingData = {
      name: '',           // PET CSD (static)
      lineSku: '',        // Brand + Pack (e.g., "Coca-Cola 300ml")
      startTime: '',
      duration: '',       // Formatted: "X DAYS, Y HRS, Z MINS"
      durationMinutes: 0, // Original minutes
      brand: '',
      pack: '',
      runStatus: 0,
      runId: 0
    };
    
    if (recordsets[0] && recordsets[0].length > 0) {
      const row = recordsets[0][0];
      
      // Extract data based on actual column names from your log
      const name = row.Name || row.name || 'PET CSD';
      const brand = row.Brand || row.brand || '';
      const pack = row.Pack || row.pack || '';
      const startTime = row.StartTime || row.startTime || '';
      const durationMinutes = parseInt(row.Duration) || 0;
      const runStatus = row.RunStatus || row.runStatus || 0;
      const runId = row.RunID || row.runId || 0;
      
      // Format start time
      let formattedStartTime = '';
      if (startTime) {
        try {
          const date = new Date(startTime);
          formattedStartTime = date.toLocaleString('en-US', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
          }).replace(',', '');
        } catch (e) {
          formattedStartTime = startTime.toString();
        }
      }
      
      // Format duration from MINUTES to "DAYS, HRS, MINS"
      let formattedDuration = '';
      if (durationMinutes > 0) {
        try {
          const totalMinutes = durationMinutes;
          const days = Math.floor(totalMinutes / (24 * 60));
          const hours = Math.floor((totalMinutes % (24 * 60)) / 60);
          const minutes = Math.floor(totalMinutes % 60);
          
          formattedDuration = `${days} DAYS, ${hours} HRS, ${minutes} MINS`;
        } catch (e) {
          formattedDuration = `${durationMinutes} MINUTES`;
        }
      } else {
        formattedDuration = '0 DAYS, 0 HRS, 0 MINS';
      }
      
      // Create Line-SKU combination: Brand + Pack
      const lineSku = `${brand} ${pack}`.trim();
      
      headingData = {
        name,
        lineSku,
        startTime: formattedStartTime,
        duration: formattedDuration,
        durationMinutes,
        brand,
        pack,
        runStatus,
        runId
      };
    } else {
      // Default data if no record found
      headingData = {
        name: 'PET CSD',
        lineSku: 'No Brand Selected',
        startTime: new Date().toLocaleString(),
        duration: '0 DAYS, 0 HRS, 0 MINS',
        durationMinutes: 0,
        brand: '',
        pack: '',
        runStatus: 0,
        runId: 0
      };
    }
    
    console.log('Processed heading data:', headingData);
    
    return {
      success: true,
      data: headingData,
      message: 'Dashboard heading retrieved successfully'
    };
  } catch (error) {
    console.error('Error executing SProc_GetDashboardHeadingDetails:', error);
    throw new Error(`Failed to fetch dashboard heading: ${error.message}`);
  }
}


async getDowntimeData(
    lineID: number,
    fromDate?: string,
    toDate?: string
  ): Promise<any> {
    try {
      await sql.connect(this.sqlConnection);
    console.log('Connected to SQL Server for ME percentage today');
    
    const request = new sql.Request();
      request.input('Pi_LineID', sql.Int, lineID);
      
      if (fromDate) {
        request.input('FromDt', sql.VarChar(20), fromDate);
      }
      if (toDate) {
        request.input('ToDt', sql.VarChar(20), toDate);
      }
      
      const result = await request.execute('sProc_LineDown');
      const recordsets = result.recordsets;

      console.log('Downtime recordsets:', recordsets);
      
      // यहाँ पर आपको 3 टेबल्स मिलेंगे:
      // recordsets[0] - Line Downtime
      // recordsets[1] - Machine Downtime  
      // recordsets[2] - Minor Downtime

      return {
        success: true,
          // data: recordsets,
        data: {
          lineDowntime: recordsets[0] || [],
          machineDowntime: recordsets[1] || [],
          minorDowntime: recordsets[2] || [],
          lineDowntimeCount: recordsets[0]?.length || 0,
          machineDowntimeCount: recordsets[1]?.length || 0,
          minorDowntimeCount: recordsets[2]?.length || 0
        },
        message: 'Downtime data retrieved successfully'
      };
    } catch (error) {
      console.error('Error executing sProc_LineDown:', error);
      throw new Error(`Failed to fetch downtime data: ${error.message}`);
    }
  }

}



// import { Injectable } from '@nestjs/common';
// import * as sql from 'mssql';
// import { sqlConnection } from '../env';

// @Injectable()
// export class DashboardService {
//   private pool: sql.ConnectionPool;
//   private sqlConnection = sqlConnection;
//   constructor() {
//     this.pool = new sql.ConnectionPool(sqlConnection);
//   }

//   async sProc_GetMasterData() {
//     try {
//       await sql.connect(this.sqlConnection);
//       console.log('Connected to SQL Server');

//       const request = new sql.Request();
//       // request.input('UESR_ID', sql.NVarChar(250), userId);
//       // request.input('USER_ACTIVE_STATUS', sql.SmallInt, activeStatus);
//       const result = await request.execute('sProc_GetMasterData');
//       // console.log('result', result);

//       const recordsets = result.recordsets;

//       await this.pool.close();
//       console.log('Multi-tab result:', recordsets);
//       return recordsets;
//     } catch (error) {
//       console.error('Error executing USP_USER_GET:', error);
//     }
//   }




//   async SProc_GetDashboardHeadingDetails(lineID: number) {
//     try {
//       await sql.connect(this.sqlConnection);
//       console.log('Connected to SQL Server');
      
//       const request = new sql.Request();
//       request.input('Pi_LineID', sql.Int, lineID);
      
//       const result = await request.execute('SProc_GetDashboardHeadingDetails');
      
//       // Process multiple recordsets
//       const recordsets = result.recordsets;
      
//       await this.pool.close();
//       console.log('SProc_GetDashboardHeadingDetails data retrieved successfully');
//       return recordsets;
//     } catch (error) {
//       console.error('Error executing SProc_GetDashboardHeadingDetails:', error);
//       throw new Error(`Failed to fetch SProc_GetDashboardHeadingDetails data: ${error.message}`);
//     }
//   } 
  
//   async sProc_GetDashBoardRecord(lineID: number) {
//     try {
//       await sql.connect(this.sqlConnection);
//       console.log('Connected to SQL Server');
      
//       const request = new sql.Request();
//       request.input('LineID', sql.Int, lineID);
      
//       const result = await request.execute('sProc_GetDashBoardRecord');
      
//       // Process multiple recordsets
//       const recordsets = result.recordsets;
      
//       await this.pool.close();
//       console.log('Dashboard data retrieved successfully');
//       return recordsets;
//     } catch (error) {
//       console.error('Error executing sProc_GetDashBoardRecord:', error);
//       throw new Error(`Failed to fetch dashboard data: ${error.message}`);
//     }
//   }



//    async getActualPlanProduction(lineID: number, startDate: string, endDate: string) {
//     try {
//       await sql.connect(this.sqlConnection);
      
//       const request = new sql.Request();
      
//       // Using query instead of procedure since it's a table-valued function
//       const query = `
//         SELECT * FROM dbo.fn_GetActualPlanProduction(
//           @LineID, 
//           @StartDT, 
//           @EndDt
//         )
//       `;
      
//       request.input('LineID', sql.Int, lineID);
//       request.input('StartDT', sql.VarChar(20), startDate);
//       request.input('EndDt', sql.VarChar(20), endDate);
      
//       const result = await request.query(query);
      
//       await this.pool.close();
      
//       return {
//         success: true,
//         data: result.recordset,
//         message: 'Actual vs Plan production data retrieved successfully'
//       };
//     } catch (error) {
//       console.error('Error fetching actual plan production:', error);
//       throw new Error(`Failed to fetch production data: ${error.message}`);
//     }
//   }

//   async getOeeDetails(runId: number, lineId: number, runDate: string) {
//     try {
//       await sql.connect(this.sqlConnection);
      
//       const request = new sql.Request();
//       request.input('RunID', sql.Int, runId);
//       request.input('LineID', sql.Int, lineId);
//       request.input('RunDT', sql.VarChar(50), runDate);
      
//       const result = await request.execute('sProc_GetOEEDetails');
      
//       await this.pool.close();
      
//       // Calculate average OEE
//       const oeeData = result.recordset;
//       const oeeSum = oeeData.reduce((sum, item) => sum + (item.OEE || 0), 0);
//       const averageOEE = oeeData.length > 0 ? oeeSum / oeeData.length : 0;

//       // Determine color based on OEE value
//       let colorCode = '#FF0000'; // Red (default)
//       if (averageOEE >= 80) {
//         colorCode = '#008000'; // Green
//       } else if (averageOEE >= 70) {
//         colorCode = '#0000FF'; // Blue
//       }

//       return {
//         success: true,
//         data: {
//           oeeValue: averageOEE,
//           colorCode: colorCode,
//           details: oeeData,
//           components: {
//             availabilityRate: oeeData[0]?.['Availability Rate'] || 0,
//             performanceRate: oeeData[0]?.['Performance Rate'] || 0,
//             qualityRate: oeeData[0]?.['Quality Rate'] || 0
//           }
//         },
//         message: 'Day OEE data retrieved successfully'
//       };
//     } catch (error) {
//       console.error('Error fetching OEE details:', error);
//       throw new Error(`Failed to fetch OEE data: ${error.message}`);
//     }
//   }


// // new run start service

// async BindRegionDDL(CompanyID: string) {
//   try {
//     await sql.connect(this.sqlConnection);
    
//     const request = new sql.Request();
//     const query = `EXEC sProc_GetRegion @Pi_RegionID=0,@Pi_CompanyId=${CompanyID}`;
    
//     const result = await request.query(query);
    
//     return {
//       success: true,
//       data: result.recordset,
//       message: 'Regions fetched successfully'
//     };
//   } catch (error) {
//     console.error('Error fetching regions:', error);
//     throw new Error(`Failed to fetch regions: ${error.message}`);
//   }
// }

// async BindPlantDDL(RegionID: string) {
//   try {
//     await sql.connect(this.sqlConnection);
    
//     const request = new sql.Request();
//     const query = `EXEC sProc_GetPlant @Status=1,@RegionID=${RegionID}`;
    
//     const result = await request.query(query);
    
//     return {
//       success: true,
//       data: result.recordset,
//       message: 'Plants fetched successfully'
//     };
//   } catch (error) {
//     console.error('Error fetching plants:', error);
//     throw new Error(`Failed to fetch plants: ${error.message}`);
//   }
// }

// async BindLineDDL(PlantID: string) {
//   try {
//     await sql.connect(this.sqlConnection);
    
//     const request = new sql.Request();
//     const query = `EXEC sProc_GetLine @Status=1,@PlantID=${PlantID}`;
    
//     const result = await request.query(query);
    
//     return {
//       success: true,
//       data: result.recordset,
//       message: 'Lines fetched successfully'
//     };
//   } catch (error) {
//     console.error('Error fetching lines:', error);
//     throw new Error(`Failed to fetch lines: ${error.message}`);
//   }
// }

// async BindPackDDL(LineID: string, CompanyID: string = "0") {
//   try {
//     await sql.connect(this.sqlConnection);
    
//     const request = new sql.Request();
    
//     // Brand के लिए query
//     const brandQuery = `EXEC sProc_GetBrand @Status=1,@LineId=${LineID},@Pi_CompanyID=${CompanyID}`;
//     const brandResult = await request.query(brandQuery);
    
//     // Pack के लिए query
//     const packQuery = `EXEC sProc_GetPack @Status=1,@LineId=${LineID},@Pi_CompanyID=${CompanyID}`;
//     const packResult = await request.query(packQuery);
    
//     return {
//       success: true,
//       data: {
//         brands: brandResult.recordset,
//         packs: packResult.recordset
//       },
//       message: 'Brands and Packs fetched successfully'
//     };
//   } catch (error) {
//     console.error('Error fetching brands and packs:', error);
//     throw new Error(`Failed to fetch brands and packs: ${error.message}`);
//   }
// }

// async GetSpeed(LineID: string, PackID: string, BrandID: string) {
//   try {
//     await sql.connect(this.sqlConnection);
    
//     const request = new sql.Request();
//     const query = `SELECT TOP 1 * FROM tbl_SpeedMaster WHERE LineID=${LineID} AND PackID=${PackID} AND BrandID=${BrandID}`;
    
//     const result = await request.query(query);
    
//     return {
//       success: true,
//       data: result.recordset.length > 0 ? result.recordset[0] : null,
//       message: 'Speed data fetched successfully'
//     };
//   } catch (error) {
//     console.error('Error fetching speed:', error);
//     throw new Error(`Failed to fetch speed data: ${error.message}`);
//   }
// }

// async StartRun(runData: {
//   lineID: string;
//   brandID: string;
//   packID: string;
//   planCase: string;
//   run_StartTime: string;
//   speed: string;
// }) {
//   try {
//     await sql.connect(this.sqlConnection);
    
//     // पहले स्टोर्ड प्रोसीजर को कॉल करें
//     const request = new sql.Request();
    
//     // पहले sProc_RunStart को कॉल करें
//     const startCheckQuery = `EXEC sProc_RunStart ${runData.lineID}`;
//     const startCheckResult = await request.query(startCheckQuery);
    
//     let message = "";
    
//     // अगर return code 0 है और message में "Already" नहीं है
//     if (startCheckResult.recordset[0]?.Return_Code === '0' && 
//         !startCheckResult.recordset[0]?.Return_MESSAGE.includes('Already')) {
      
//       // फिर sProc_AddRunMaster को INSERT मोड में कॉल करें
//       const addRunQuery = `EXEC sProc_AddRunMaster @TransType='I',@lineID=${runData.lineID},@brandID=${runData.brandID},@packID=${runData.packID},@PlanCase=${runData.planCase},@run_StartTime='${runData.run_StartTime}',@Speed=${runData.speed},@run_EndTime=null`;
//       const addRunResult = await request.query(addRunQuery);
      
//       message = addRunResult.recordset[0]?.Return_MESSAGE || 'Run started successfully';
//     } else {
//       // अगर पहले से run चल रहा है तो UPDATE करें
//       message = startCheckResult.recordset[0]?.Return_MESSAGE || '';
      
//       if (message.includes('Already')) {
//         const updateRunQuery = `EXEC sProc_AddRunMaster @TransType='U',@lineID=${runData.lineID},@run_StartTime='${runData.run_StartTime}',@PlanCase=${runData.planCase},@Speed=${runData.speed}`;
//         const updateResult = await request.query(updateRunQuery);
//         message = 'Run Updated Successfully.';
//       } else {
//         // Format the message like in .NET code
//         const index = message.indexOf('-');
//         if (index > -1) {
//           const datePart = message.substring(index + 1);
//           const formattedDate = new Date(datePart).toLocaleString('en-US', {
//             day: '2-digit',
//             month: 'short',
//             year: 'numeric',
//             hour: '2-digit',
//             minute: '2-digit',
//             second: '2-digit',
//             hour12: false
//           });
//           message = message.substring(0, index + 1) + formattedDate;
//         }
//       }
//     }
    
//     return {
//       success: true,
//       message: message,
//       data: startCheckResult.recordset
//     };
//   } catch (error) {
//     console.error('Error starting run:', error);
//     throw new Error(`Failed to start run: ${error.message}`);
//   }
// }

// async StopRun(runData: {
//   lineID: string;
//   run_EndTime: string;
//   run_StartTime: string;
//   planCase: string;
//   speed: string;
// }) {
//   try {
//     await sql.connect(this.sqlConnection);
    
//     const request = new sql.Request();
//     const query = `EXEC sProc_AddRunMaster @TransType='U',@lineID=${runData.lineID},@run_EndTime='${runData.run_EndTime}',@run_StartTime='${runData.run_StartTime}',@PlanCase=${runData.planCase},@Speed=${runData.speed}`;
    
//     const result = await request.query(query);
    
//     return {
//       success: true,
//       message: result.recordset[0]?.Return_MESSAGE || 'Run stopped successfully',
//       data: result.recordset
//     };
//   } catch (error) {
//     console.error('Error stopping run:', error);
//     throw new Error(`Failed to stop run: ${error.message}`);
//   }
// }

// async BindRunDetails() {
//   try {
//     await sql.connect(this.sqlConnection);
    
//     const request = new sql.Request();
//     // यह query आपके डेटाबेस के अनुसार adjust करनी होगी
//     const query = `SELECT TOP 1 * FROM tbl_RunMaster WHERE run_EndTime IS NULL ORDER BY run_StartTime DESC`;
    
//     const result = await request.query(query);
    
//     return {
//       success: true,
//       data: result.recordset.length > 0 ? result.recordset[0] : null,
//       message: 'Run details fetched successfully'
//     };
//   } catch (error) {
//     console.error('Error fetching run details:', error);
//     throw new Error(`Failed to fetch run details: ${error.message}`);
//   }
// }


// }


//   // async getDayOEE(lineId: number, date?: string) {
//   //   try {
//   //     await sql.connect(this.sqlConnection);
      
//   //     const request = new sql.Request();
//   //     const runDate = date || new Date().toLocaleDateString('en-GB', {
//   //       day: '2-digit',
//   //       month: 'short',
//   //       year: 'numeric'
//   //     });

//   //     request.input('RunID', sql.Int, 0);
//   //     request.input('LineID', sql.Int, lineId);
//   //     request.input('RunDT', sql.VarChar(50), runDate);
      
//   //     const result = await request.execute('sProc_GetOEEDetails');
      
//   //     await this.pool.close();

//   //     // Calculate average OEE
//   //     const oeeData = result.recordset;
//   //     const oeeSum = oeeData.reduce((sum, item) => sum + (item.OEE || 0), 0);
//   //     const averageOEE = oeeData.length > 0 ? oeeSum / oeeData.length : 0;

//   //     // Determine color based on OEE value
//   //     let colorCode = '#FF0000'; // Red (default)
//   //     if (averageOEE >= 80) {
//   //       colorCode = '#008000'; // Green
//   //     } else if (averageOEE >= 70) {
//   //       colorCode = '#0000FF'; // Blue
//   //     }

//   //     return {
//   //       success: true,
//   //       data: {
//   //         oeeValue: averageOEE,
//   //         colorCode: colorCode,
//   //         details: oeeData,
//   //         components: {
//   //           availabilityRate: oeeData[0]?.['Availability Rate'] || 0,
//   //           performanceRate: oeeData[0]?.['Performance Rate'] || 0,
//   //           qualityRate: oeeData[0]?.['Quality Rate'] || 0
//   //         }
//   //       },
//   //       message: 'Day OEE data retrieved successfully'
//   //     };
//   //   } catch (error) {
//   //     console.error('Error fetching Day OEE:', error);
//   //     throw new Error(`Failed to fetch Day OEE data: ${error.message}`);
//   //   }
//   // }

//   // async getDayOEEToday(lineId: number) {
//   //   return this.getDayOEE(lineId);
//   // }