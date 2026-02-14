import {
  Controller,
  Post,
  Body,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { EdtsService } from './edts.service';
import { DashboardRequest } from './dto/dashboard.dto';
import { RegionApiResponse, RegionRequest } from './dto/region.dto';
import { PlantApiResponse, PlantRequest } from './dto/plant.dto';
import { BrandRequest, BrandApiResponse } from './dto/brand.dto';
import { LineRequest, LineApiResponse } from './dto/line.dto';
import { PackRequest, PackApiResponse } from './dto/pack.dto';

@Controller('eDTS')
export class EdtsController {
  constructor(private readonly edtsService: EdtsService) {}

  @Post('Dashboard')
  async getDashboard(@Body() dashboardRequest: DashboardRequest) {
    try {
      if (!dashboardRequest.LineID || dashboardRequest.LineID <= 0) {
        throw new HttpException(
          'Valid LineID is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.edtsService.getDashboardData(dashboardRequest);

      // Return the exact format as .NET API
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Return error in the same format as .NET
      return {
        TagDetail: [],
        RunDetail: null,
        CIPDetail: null,
        RunID: 0,
        LineID: dashboardRequest?.LineID || 0,
        OEE: 0,
        ReturnCode: -3,
        ReturnMessage: error.message || 'Failed to fetch dashboard data',
      };
    }
  }

  @Post('GetRegion')
  async getRegion(
    @Body() regionRequest: RegionRequest,
  ): Promise<RegionApiResponse> {
    try {
      if (!regionRequest.CompanyId || regionRequest.CompanyId <= 0) {
        throw new HttpException(
          'Valid CompanyId is required',
          HttpStatus.BAD_REQUEST,
        );
      }

      const result = await this.edtsService.getRegionData(regionRequest);

      // Return the exact format as .NET API
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }

      // Return error in the same format as .NET
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message || 'Failed to fetch region data',
      };
    }
  }


  @Post('GetPlant')
  async getPlant(@Body() plantRequest: PlantRequest): Promise<PlantApiResponse> {
    try {
      const result = await this.edtsService.getPlantData(plantRequest);
      
      // Return the exact format as .NET API
      return result;
      
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      
      // Return error in the same format as .NET
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message || 'Failed to fetch plant data'
      };
    }
  }
  

  
  @Post('GetLine')
  async getLine(@Body() lineRequest: LineRequest): Promise<LineApiResponse> {
    try {
      const result = await this.edtsService.getLineData(lineRequest);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message || 'Failed to fetch line data',
      };
    }
  }

  @Post('GetBrand')
  async getBrand(@Body() brandRequest: BrandRequest): Promise<BrandApiResponse> {
    try {
      if (!brandRequest.CompanyID || brandRequest.CompanyID <= 0) {
        throw new HttpException(
          'Valid CompanyID is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.edtsService.getBrandData(brandRequest);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message || 'Failed to fetch brand data',
      };
    }
  }

  @Post('GetPack')
  async getPack(@Body() packRequest: PackRequest): Promise<PackApiResponse> {
    try {
      if (!packRequest.CompanyID || packRequest.CompanyID <= 0) {
        throw new HttpException(
          'Valid CompanyID is required',
          HttpStatus.BAD_REQUEST,
        );
      }
      const result = await this.edtsService.getPackData(packRequest);
      return result;
    } catch (error) {
      if (error instanceof HttpException) {
        throw error;
      }
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message || 'Failed to fetch pack data',
      };
    }
  }
  
  // new add run and cip apis can be added here
  @Post('GetCIPList')
  async getCIPList() {
    try {
      const result = await this.edtsService.getCIPList();
      return result;
    } catch (error) {
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message
      };
    }
  }

  @Post('RunStart')
  async runStart(@Body() runData: any) {
    try {
      if (!runData.lineID || runData.lineID <= 0) {
        throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
      }
      const result = await this.edtsService.runStart(runData);
      return result;
    } catch (error) {
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message
      };
    }
  }

   @Post('UpdateRun')
  async updateRun(@Body() runData: any) {
    try {
      if (!runData.lineID || runData.lineID <= 0) {
        throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
      }
      
      const result = await this.edtsService.updateRun(runData);
      return result;
    } catch (error) {
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message
      };
    }
  }

  @Post('StopRun')
async stopRun(@Body() runData: any) {
  try {
    if (!runData.lineID || runData.lineID <= 0) {
      throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
    }
    
    if (!runData.runEndTime) {
      throw new HttpException('RunEndTime is required', HttpStatus.BAD_REQUEST);
    }
    
    const result = await this.edtsService.stopRun(runData);
    return result;
  } catch (error) {
    return {
      Return_Code: -3,
      Return_MESSAGE: error.message
    };
  }
}

  @Post('CIPStart')
  async cipStart(@Body() cipData: any) {
    try {
      if (!cipData.lineID || cipData.lineID <= 0) {
        throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
      }
      const result = await this.edtsService.cipStart(cipData);
      return result;
    } catch (error) {
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message
      };
    }
  }

  @Post('CIPStop')
  async cipStop(@Body() cipData: any) {
    try {
      if (!cipData.lineID || cipData.lineID <= 0) {
        throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
      }
      const result = await this.edtsService.cipStop(cipData);
      return result;
    } catch (error) {
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message
      };
    }
  }

  @Post('CheckRunStatus')
  async checkRunStatus(@Body() requestData: any) {
    try {
      if (!requestData.lineID || requestData.lineID <= 0) {
        throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
      }
      const result = await this.edtsService.checkRunStatus(requestData.lineID);
      return result;
    } catch (error) {
      return {
        Return_Code: -3,
        Return_MESSAGE: error.message
      };
    }
  }
  



  // src/controllers/run.controller.ts

// For Run
@Post('GetActiveRun')
async getActiveRun(@Body() runData: any) {
  try {
    if (!runData.lineID || runData.lineID <= 0) {
      throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
    }
    
    const result = await this.edtsService.getActiveRun(runData);
    return result;
  } catch (error) {
    return {
      Return_Code: -3,
      Return_MESSAGE: error.message
    };
  }
}

// For CIP
@Post('GetActiveCIP')
async getActiveCIP(@Body() cipData: any) {
  try {
    if (!cipData.lineID || cipData.lineID <= 0) {
      throw new HttpException('Valid LineID is required', HttpStatus.BAD_REQUEST);
    }
    
    const result = await this.edtsService.getActiveCIP(cipData);
    return result;
  } catch (error) {
    return {
      Return_Code: -3,
      Return_MESSAGE: error.message
    };
  }
}

}

// import {
//   Controller,
//   Post,
//   Get,
//   Body,
//   Param,
//   Query,
//   Headers,
//   HttpStatus,
//   HttpException
// } from '@nestjs/common';
// import { EdtsService } from './edts.service';
// import * as DTO from './dtos';
// import * as Interfaces from './interfaces';

// @Controller('eDTS')
// export class EdtsController {
//   constructor(private readonly eDTSService: EdtsService) {}

//   @Post('GetUserListByURL')
//   async getUserListByURL(@Body() oRequest: DTO.RunStartRequest): Promise<DTO.UserList> {
//     return this.eDTSService.getUserListByURL(oRequest);
//   }

//   @Post('AppStart')
//   async appStart(@Body() oRequest: DTO.MainPageDataRequest): Promise<Interfaces.MainPageDataResponse> {
//     return this.eDTSService.appStart(oRequest);
//   }

//   @Post('GetRunDetails')
//   async getRunDetails(@Body() oRequest: DTO.RunMaster): Promise<DTO.RunList> {
//     return this.eDTSService.getRunDetails(oRequest);
//   }

//   @Post('RunStart')
//   async runStart(@Body() oRequest: DTO.RunStartRequest): Promise<DTO.RunStart> {
//     return this.eDTSService.runStart(oRequest);
//   }

//   @Get('LineMaster')
//   async getLineMaster(): Promise<Interfaces.LineList> {
//     return this.eDTSService.getLineMaster();
//   }

//   @Get('GetTagMaster')
//   async getTagMaster(): Promise<any> {
//     return this.eDTSService.getTagMaster();
//   }

//   @Post('GetOEE')
//   async getOEE(@Query('LineID') lineID: string): Promise<any> {
//     return this.eDTSService.getOEE(lineID);
//   }

//   @Post('PackBrand')
//   async getPackBrand(@Body() oRequest: DTO.PackBrandRequest): Promise<Interfaces.PackBrand> {
//     return this.eDTSService.getPackBrand(oRequest);
//   }

//   @Post('InitiateRun')
//   async initiateRun(@Body() oRequest: DTO.InitiateRun): Promise<DTO.InitiateRun> {
//     return this.eDTSService.initiateRun(oRequest);
//   }

//   @Post('TerminateRun')
//   async terminateRun(@Body() oRequest: DTO.TerminateRun): Promise<DTO.TerminateRun> {
//     return this.eDTSService.terminateRun(oRequest);
//   }

//   @Post('Dashboard')
//   async dashboard(@Body() oRequest: DTO.DashboardRequest): Promise<DTO.DashboardResponse> {
//     return this.eDTSService.dashboard(oRequest);
//   }

//   @Post('MePercetange')
//   async mePercetange(@Body() request: Interfaces.MePercentageRequest): Promise<Interfaces.MePercetangeResponse> {
//     return this.eDTSService.mePercetange(request);
//   }

//   @Get('LocalCPUStatus')
//   async localCPUStatus(): Promise<Interfaces.LocalCPUStatusResponse> {
//     return this.eDTSService.localCPUStatus();
//   }

//   @Post('Downtime')
//   async downtime(@Body() oRequest: DTO.DashboardRequest): Promise<DTO.DowntimeResponse> {
//     return this.eDTSService.downtime(oRequest);
//   }

//   @Post('GetLossStructure')
//   async getLossStructure(@Body() oRequest: DTO.LosstructureResponse): Promise<DTO.LossStructure> {
//     return this.eDTSService.getLossStructure(oRequest);
//   }

//   @Post('GetAssetByLossStructure')
//   async getAssetByLossStructure(@Body() oRequest: DTO.AssetResponse): Promise<DTO.AssetByLossStructure> {
//     return this.eDTSService.getAssetByLossStructure(oRequest);
//   }

//   @Post('GetComponentByAssetID')
//   async getComponentByAssetID(@Body() oRequest: DTO.ComponentResponse): Promise<DTO.ComponentByAsset> {
//     return this.eDTSService.getComponentByAssetID(oRequest);
//   }

//   @Post('GetFailureByComponentID')
//   async getFailureByComponentID(@Body() oRequest: DTO.FailureResponse): Promise<DTO.FailureByComponentID> {
//     return this.eDTSService.getFailureByComponentID(oRequest);
//   }

//   @Post('UpdateDownTime')
//   async updateDownTime(@Body() oRequest: DTO.UpdateDownTime): Promise<DTO.UpdateDownTime> {
//     return this.eDTSService.updateDownTime(oRequest);
//   }

//   @Post('CIPList')
//   async cipList(): Promise<DTO.CIPReason> {
//     return this.eDTSService.cipList();
//   }

//   @Post('CIPStart')
//   async cipStart(@Body() oRequest: DTO.CIPStartResponse): Promise<DTO.CIPStartResponse> {
//     return this.eDTSService.cipStart(oRequest);
//   }

//   @Post('CIPStop')
//   async cipStop(@Body() oRequest: DTO.CIPStopResponse): Promise<DTO.CIPStopResponse> {
//     return this.eDTSService.cipStop(oRequest);
//   }

//   @Post('DataEntry')
//   async dataEntryDetails(@Body() oRequest: Interfaces.DataEntry): Promise<Interfaces.DataEntry> {
//     return this.eDTSService.dataEntryDetails(oRequest);
//   }

//   @Post('ShiftDetails')
//   async getShiftMaster(): Promise<Interfaces.ShiftMasterResponse> {
//     return this.eDTSService.getShiftMaster();
//   }

//   @Post('UserDetailByShift')
//   async userDetailByShift(@Body() oRequest: DTO.UserDetailByShiftRequest): Promise<DTO.UserDetailByShift> {
//     return this.eDTSService.userDetailByShift(oRequest);
//   }

//   @Post('SaveOperatorByShiftID')
//   async saveOperatorByShiftID(@Body() oRequest: DTO.SaveOperatorByShiftIDRequest): Promise<DTO.SaveOperatorByShiftIDresponse> {
//     return this.eDTSService.saveOperatorByShiftID(oRequest);
//   }

//   @Post('UpdateUserLoginTimeLog')
//   async updateUserLoginTimeLog(@Body() oRequest: DTO.SaveOperatorByShiftIDRequest): Promise<DTO.SaveOperatorByShiftIDresponse> {
//     return this.eDTSService.updateUserLoginTimeLog(oRequest);
//   }

//   @Post('UpdateOperatorLogoutTime')
//   async updateOperatorLogoutTime(@Body() oRequest: DTO.UpdateOperatorLogoutTimeRequest): Promise<DTO.UpdateOperatorLogoutTimeRequest> {
//     return this.eDTSService.updateOperatorLogoutTime(oRequest);
//   }

//   @Post('GetAllOperators')
//   async getAllOperators(@Body() oRequest: DTO.GetAllOperatorsRequest): Promise<DTO.GetAllOperatorsResponse> {
//     return this.eDTSService.getAllOperators(oRequest);
//   }

//   @Post('NotificationCheck')
//   async getNotification(@Body() notificationRequest: DTO.NotificationRequest): Promise<DTO.Notification> {
//     return this.eDTSService.getNotification(notificationRequest);
//   }

//   @Post('AppDashboardBD')
//   async getAppDashboardBD(@Body() oRequest: Interfaces.DashboardBDRequest): Promise<Interfaces.DashboardBDResponse> {
//     return this.eDTSService.getAppDashboardBD(oRequest);
//   }

//   @Post('GetStartTimeUserName')
//   async startTimeUserName(@Body() oRequest: Interfaces.StartTimeByUserNameRequest): Promise<Interfaces.StartTimeByUserName> {
//     return this.eDTSService.startTimeUserName(oRequest);
//   }

//   @Post('UpdateAssetStatus')
//   async updateAssetStatus(@Body() oRequest: Interfaces.UpdateAssetStatusRequest): Promise<Interfaces.AssetStatus> {
//     return this.eDTSService.updateAssetStatus(oRequest);
//   }

//   @Post('FirebaseNotification')
//   async getFireBaseNotification(@Body() notificationRequest: DTO.NotificationRequest): Promise<DTO.Notification> {
//     return this.eDTSService.getFireBaseNotification(notificationRequest);
//   }

//   @Post('DeviceIDAfterLogin')
//   async getDeviceCaptureResponseLogin(@Body() oRequest: DTO.LoginRequest): Promise<DTO.LoginResponse> {
//     return this.eDTSService.getDeviceCaptureResponseLogin(oRequest);
//   }

//   @Post('GetDeviceOnLogout')
//   async getDeviceCaptureOnLogut(@Body() request: DTO.DeviceCaptureRequest): Promise<DTO.DeviceCaptureResponse> {
//     return this.eDTSService.getDeviceCaptureOnLogut(request);
//   }

//   @Post('GetShiftData')
//   async getShiftDataResponse(@Body() request: Interfaces.ShiftDataRequest): Promise<Interfaces.ShiftDataResponse> {
//     return this.eDTSService.getShiftDataResponse(request);
//   }

//   @Post('UpdateRemarkCIP')
//   async updateRemarksCIP(@Body() request: DTO.CIPUpdateRequest): Promise<DTO.CIPUpdateResponse> {
//     return this.eDTSService.updateRemarksCIP(request);
//   }

//   @Post('Downtimehistory')
//   async downtimehistory(@Body() orequest: DTO.DowntimeHistoryRequest): Promise<DTO.DowntimeHistoryResponse> {
//     return this.eDTSService.downtimehistory(orequest);
//   }

//   @Post('USLEPerByLineToday')
//   async uslePerByLineToday(@Body() orequest: Interfaces.USLERequest): Promise<Interfaces.USLEResponse> {
//     return this.eDTSService.uslePerByLineToday(orequest);
//   }

//   @Post('GetShiftHourlyData')
//   async getShiftHourlyDataResponse(@Body() request: Interfaces.ShiftDataRequest): Promise<Interfaces.ShiftDataResponse> {
//     return this.eDTSService.getShiftHourlyDataResponse(request);
//   }

//   @Post('CheckUrl')
//   async checkUrl(@Body() objUrl: Interfaces.CheckUrl): Promise<Interfaces.CheckUrl> {
//     return this.eDTSService.checkUrl(objUrl);
//   }

//   @Post('Login')
//   async managerLogin(
//     @Headers('Password') password: string,
//     @Body() oRequest: DTO.LoginRequest
//   ): Promise<DTO.LoginResponse> {
//     return this.eDTSService.managerLogin(password, oRequest);
//   }

//   @Post('GetLine')
//   async getLineList(): Promise<Interfaces.LineResponse> {
//     return this.eDTSService.getLineList();
//   }

//   @Post('GetReportGraph')
//   async getDashboardIOS(@Body() oRequest: Interfaces.GetDashboardRequest): Promise<Interfaces.GetDashboardResponse> {
//     return this.eDTSService.getDashboardIOS(oRequest);
//   }

//   @Post('GetLineList')
//   async getLineResponse(): Promise<Interfaces.GetLineListResponse> {
//     return this.eDTSService.getLineResponse();
//   }

//   @Post('DownTimeReport')
//   async getLineResponseDownTime(@Body() request: Interfaces.DownTimeRequest): Promise<Interfaces.DownTimeResponse> {
//     return this.eDTSService.getLineResponseDownTime(request);
//   }

//   @Post('PushNotification')
//   async pushNotification(@Body() request: DTO.PushNotificationRequest): Promise<DTO.PushNotificationResponse> {
//     return this.eDTSService.pushNotification(request);
//   }

//   @Post('InsertUpRejection')
//   async insertUpRejection(@Body() oRequest: Interfaces.RejectionRequest): Promise<Interfaces.RejectionRequest> {
//     return this.eDTSService.insertUpRejection(oRequest);
//   }

//   @Post('GetRejection')
//   async getRejection(@Body() oRequest: Interfaces.RejectionResponse): Promise<Interfaces.RejectionResponse> {
//     return this.eDTSService.getRejection(oRequest);
//   }

//   @Get('GetRejectionByID')
//   async getRejectionByID(@Query('RejectionID') rejectionID: string): Promise<Interfaces.RejectionResponse> {
//     return this.eDTSService.getRejectionByID(rejectionID);
//   }

//   @Post('ReworkMaster')
//   async reworkMaster(): Promise<Interfaces.ReworkTypeResponse> {
//     return this.eDTSService.reworkMaster();
//   }
// }
