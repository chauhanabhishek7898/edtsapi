export class DashboardRequest {
  RunID: number;
  LineID: number;
  UserID: string;
  TabName: string;
}

export class DashboardResponse {
  TagDetail: TagDetails[] = [];
 RunDetail?: RunDetail | null; 
  CIPDetail?: CIPDetail | null; 
  RunID: number = 0;
  LineID: number = 0;
  OEE: number = 0;
  ReturnCode: number = 0;
  ReturnMessage: string = '';
}

export class TagDetails {
  NextApi: any = {};
  TagName: string;
  TagID: number;
  BPM: number;
  StoppageCount: number;
  StoppageTime: string;
  SpeedBMPLabel: string;
  StoppageCountLabel: string;
  StoppageTimeLabel: string;
  StartDateLabel: string;
  StartDate: string;
  NotOperationStatus: number;
  MeValueDetail: any[] | null;
  UsleDetail: any[] | null;
  USLEPers: string | null;
  ButtonName: string;
  Status: number;
  ButtonActiveColor: string;
  ButtonDeactiveColor: string;
  FontColor: string;
  CIPID: number;
  API: any;
  Keys: any;
}

export class RunDetail {
  RunID: number;
  RunStartTime: string;
  RunEndTime: string;
  Brand: string;
  Pack: string;
  RunStatus: string;
  BackColor: string;
  FontColor: string;
  PlanCase: number;
}

export class CIPDetail {
  CIPID: number;
  CipStartTime: string;
  CipEndTime: string;
  CipStatus: string;
  BackColor: string;
  FontColor: string;
  Reason: string;
  UserID: number;
  UserName: string;
  Remark: string;
}

export class MeValue {
  Shift: string;
  Me: string;
}

export class USLEValue {
  Shift: string;
  USLE: string;
}