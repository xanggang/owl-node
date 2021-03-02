// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportLogBody from '../../../app/model/logBody';
import ExportLogDetail from '../../../app/model/logDetail';
import ExportProject from '../../../app/model/project';

declare module 'egg' {
  interface IModel {
    LogBody: ReturnType<typeof ExportLogBody>;
    LogDetail: ReturnType<typeof ExportLogDetail>;
    Project: ReturnType<typeof ExportProject>;
  }
}
