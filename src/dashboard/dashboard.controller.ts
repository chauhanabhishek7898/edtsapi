// dashboard.controller.ts
import { 
  Controller, 
  Get, 
  HttpException, 
  HttpStatus, 
  Param, 
  ParseIntPipe, 
  Query 
} from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('main-data/:lineID')
  async getMainDashboardData(@Param('lineID', ParseIntPipe) lineID: number) {
    try {
      if (!lineID || lineID <= 0) {
        throw new HttpException(
          'Valid LineID is required',
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.dashboardService.getMainDashboardData(lineID);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch dashboard data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('me-chart/:lineID')
  async getMeChartData(@Param('lineID', ParseIntPipe) lineID: number) {
    try {
      if (!lineID || lineID <= 0) {
        throw new HttpException(
          'Valid LineID is required',
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.dashboardService.getMeChartData(lineID);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch ME chart data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('loss-chart/:lineID')
  async getLossChartData(@Param('lineID', ParseIntPipe) lineID: number) {
    try {
      if (!lineID || lineID <= 0) {
        throw new HttpException(
          'Valid LineID is required',
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.dashboardService.getLossChartData(lineID);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch loss chart data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('me-percentage-today/:lineID')
  async getMePercentageToday(@Param('lineID', ParseIntPipe) lineID: number) {
    try {
      if (!lineID || lineID <= 0) {
        throw new HttpException(
          'Valid LineID is required',
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.dashboardService.getMePercentageToday(lineID);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch ME percentage data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('dashboard-heading/:lineID')
  async getDashboardHeading(@Param('lineID', ParseIntPipe) lineID: number) {
    try {
      if (!lineID || lineID <= 0) {
        throw new HttpException(
          'Valid LineID is required',
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.dashboardService.getDashboardHeading(lineID);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch dashboard heading',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }



    @Get('downtimedata/:lineID')
  async getDowntimeData(
    @Param('lineID', ParseIntPipe) lineID: number,
    @Query('fromDate') fromDate?: string,
    @Query('toDate') toDate?: string
  ) {
    try {
      if (!lineID || lineID <= 0) {
        throw new HttpException(
          'Valid LineID is required',
          HttpStatus.BAD_REQUEST
        );
      }
      return await this.dashboardService.getDowntimeData(lineID, fromDate, toDate);
    } catch (error) {
      throw new HttpException(
        error.message || 'Failed to fetch downtime data',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}



// import { Body, Controller, Get, HttpException, HttpStatus, Param, ParseIntPipe, Post, Query } from '@nestjs/common';
// import { DashboardService } from './dashboard.service';

// @Controller('dashboard')
// export class DashboardController {
//   constructor(private readonly dashboardService: DashboardService) {}

//   @Get('master-data')
//   async sProc_GetMasterData() {
//     return this.dashboardService.sProc_GetMasterData();
//   }




//   @Get('GetDashboardHeadingDetails/:lineID')
//   async SProc_GetDashboardHeadingDetails(@Param('lineID', ParseIntPipe) lineID: number) {
//     return this.dashboardService.SProc_GetDashboardHeadingDetails(lineID);
//   }

//   @Get('dashboard-data/:lineID')
//   async sProc_GetDashBoardRecord(@Param('lineID', ParseIntPipe) lineID: number) {
//     try {
//       if (!lineID || lineID <= 0) {
//         throw new HttpException(
//           'Valid LineID is required',
//           HttpStatus.BAD_REQUEST
//         );
//       }

//       return await this.dashboardService.sProc_GetDashBoardRecord(lineID);
//     } catch (error) {
//       if (error instanceof HttpException) {
//         throw error;
//       }
      
//       throw new HttpException(
//         error.message || 'Failed to fetch dashboard data',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }


//   @Get('actual-plan/:lineID/:startDate/:endDate')
//   async getActualPlanProduction(
//     @Param('lineID', ParseIntPipe) lineID: number,
//     @Param('startDate') startDate: string,
//     @Param('endDate') endDate: string
//   ) {
//     try {
//       if (!lineID || lineID <= 0) {
//         throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
//       }

//       if (!startDate || !endDate) {
//         throw new HttpException('Start date and end date are required', HttpStatus.BAD_REQUEST);
//       }

//       return await this.dashboardService.getActualPlanProduction(lineID, startDate, endDate);
//     } catch (error) {
//       if (error instanceof HttpException) {
//         throw error;
//       }
      
//       throw new HttpException(
//         error.message || 'Failed to fetch production data',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }

//   @Get('details/:runId/:lineId/:runDate')
//   async getOeeDetails(
//     @Param('runId', new ParseIntPipe({ optional: true })) runId: number = 0,
//     @Param('lineId', ParseIntPipe) lineId: number,
//     @Param('runDate') runDate: string
//   ) {
//     try {
//       if (!lineId || lineId <= 0) {
//         throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
//       }

//       return await this.dashboardService.getOeeDetails(runId, lineId, runDate);
//     } catch (error) {
//       if (error instanceof HttpException) {
//         throw error;
//       }
      
//       throw new HttpException(
//         error.message || 'Failed to fetch OEE details',
//         HttpStatus.INTERNAL_SERVER_ERROR
//       );
//     }
//   }


//   //  new run start code

//   @Get('regions/:companyId')
// async getRegions(@Param('companyId') companyId: string) {
//   try {
//     return await this.dashboardService.BindRegionDDL(companyId);
//   } catch (error) {
//     throw new HttpException(
//       error.message || 'Failed to fetch regions',
//       HttpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// }

// @Get('plants/:regionId')
// async getPlants(@Param('regionId') regionId: string) {
//   try {
//     return await this.dashboardService.BindPlantDDL(regionId);
//   } catch (error) {
//     throw new HttpException(
//       error.message || 'Failed to fetch plants',
//       HttpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// }

// @Get('lines/:plantId')
// async getLines(@Param('plantId') plantId: string) {
//   try {
//     return await this.dashboardService.BindLineDDL(plantId);
//   } catch (error) {
//     throw new HttpException(
//       error.message || 'Failed to fetch lines',
//       HttpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// }

// @Get('brands-packs/:lineId')
// async getBrandsAndPacks(
//   @Param('lineId') lineId: string,
//   @Query('companyId') companyId: string = "0"
// ) {
//   try {
//     return await this.dashboardService.BindPackDDL(lineId, companyId);
//   } catch (error) {
//     throw new HttpException(
//       error.message || 'Failed to fetch brands and packs',
//       HttpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// }

// @Get('speed/:lineId/:packId/:brandId')
// async getSpeed(
//   @Param('lineId') lineId: string,
//   @Param('packId') packId: string,
//   @Param('brandId') brandId: string
// ) {
//   try {
//     return await this.dashboardService.GetSpeed(lineId, packId, brandId);
//   } catch (error) {
//     throw new HttpException(
//       error.message || 'Failed to fetch speed',
//       HttpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// }

// @Post('start-run')
// async startRun(@Body() runData: any) {
//   try {
//     return await this.dashboardService.StartRun(runData);
//   } catch (error) {
//     throw new HttpException(
//       error.message || 'Failed to start run',
//       HttpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// }

// @Post('stop-run')
// async stopRun(@Body() runData: any) {
//   try {
//     return await this.dashboardService.StopRun(runData);
//   } catch (error) {
//     throw new HttpException(
//       error.message || 'Failed to stop run',
//       HttpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// }

// @Get('run-details')
// async getRunDetails() {
//   try {
//     return await this.dashboardService.BindRunDetails();
//   } catch (error) {
//     throw new HttpException(
//       error.message || 'Failed to fetch run details',
//       HttpStatus.INTERNAL_SERVER_ERROR
//     );
//   }
// }
// }


//   // @Get('day/:lineId/:date')
//   // async getDayOEE(
//   //   @Param('lineId', ParseIntPipe) lineId: number,
//   //   @Param('date') date?: string
//   // ) {
//   //   try {
//   //     if (!lineId || lineId <= 0) {
//   //       throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
//   //     }

//   //     return await this.dashboardService.getDayOEE(lineId, date);
//   //   } catch (error) {
//   //     if (error instanceof HttpException) {
//   //       throw error;
//   //     }
      
//   //     throw new HttpException(
//   //       error.message || 'Failed to fetch Day OEE data',
//   //       HttpStatus.INTERNAL_SERVER_ERROR
//   //     );
//   //   }
//   // }

//   // @Get('day1/today/:lineId')
//   // async getDayOEEToday(@Param('lineId', ParseIntPipe) lineId: number) {
//   //   try {
//   //     if (!lineId || lineId <= 0) {
//   //       throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
//   //     }

//   //     return await this.dashboardService.getDayOEEToday(lineId);
//   //   } catch (error) {
//   //     if (error instanceof HttpException) {
//   //       throw error;
//   //     }
      
//   //     throw new HttpException(
//   //       error.message || 'Failed to fetch today\'s OEE data',
//   //       HttpStatus.INTERNAL_SERVER_ERROR
//   //     );
//   //   }
//   // }

//   // @Get('day/today')
//   // async getDayOEETodayDefault() {
//   //   try {
//   //     const defaultLineId = 7; // Adjust based on your requirements
//   //     return await this.dashboardService.getDayOEEToday(defaultLineId);
//   //   } catch (error) {
//   //     throw new HttpException(
//   //       error.message || 'Failed to fetch today\'s OEE data',
//   //       HttpStatus.INTERNAL_SERVER_ERROR
//   //     );
//   //   }
//   // }