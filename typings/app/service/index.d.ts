// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
type AnyClass = new (...args: any[]) => any;
type AnyFunc<T = any> = (...args: any[]) => T;
type CanExportFunc = AnyFunc<Promise<any>> | AnyFunc<IterableIterator<any>>;
type AutoInstanceType<T, U = T extends CanExportFunc ? T : T extends AnyFunc ? ReturnType<T> : T> = U extends AnyClass ? InstanceType<U> : U;
import ExportApiError from '../../../app/service/apiError';
import ExportDevice from '../../../app/service/device';
import ExportLogBody from '../../../app/service/logBody';
import ExportLogDetail from '../../../app/service/logDetail';
import ExportPerformance from '../../../app/service/performance';
import ExportProject from '../../../app/service/project';

declare module 'egg' {
  interface IService {
    apiError: AutoInstanceType<typeof ExportApiError>;
    device: AutoInstanceType<typeof ExportDevice>;
    logBody: AutoInstanceType<typeof ExportLogBody>;
    logDetail: AutoInstanceType<typeof ExportLogDetail>;
    performance: AutoInstanceType<typeof ExportPerformance>;
    project: AutoInstanceType<typeof ExportProject>;
  }
}
