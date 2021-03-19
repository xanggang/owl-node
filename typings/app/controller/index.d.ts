// This file is created by egg-ts-helper@1.25.8
// Do not modify this file!!!!!!!!!

import 'egg';
import ExportHome from '../../../app/controller/home';
import ExportLog from '../../../app/controller/log';
import ExportProject from '../../../app/controller/project';
import ExportStore from '../../../app/controller/store';

declare module 'egg' {
  interface IController {
    home: ExportHome;
    log: ExportLog;
    project: ExportProject;
    store: ExportStore;
  }
}
