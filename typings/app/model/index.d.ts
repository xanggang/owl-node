// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportApiError from '../../../app/model/apiError';
import ExportDevice from '../../../app/model/device';
import ExportLogBody from '../../../app/model/logBody';
import ExportLogDetail from '../../../app/model/logDetail';
import ExportPerformance from '../../../app/model/performance';
import ExportProject from '../../../app/model/project';

declare module 'egg' {
  interface IModel {
    ApiError: ReturnType<typeof ExportApiError>;
    Device: ReturnType<typeof ExportDevice>;
    LogBody: ReturnType<typeof ExportLogBody>;
    LogDetail: ReturnType<typeof ExportLogDetail>;
    Performance: ReturnType<typeof ExportPerformance>;
    Project: ReturnType<typeof ExportProject>;
  }
}
