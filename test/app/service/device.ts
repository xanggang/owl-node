import { app } from 'egg-mock/bootstrap';
// import assert from 'assert'
// @ts-ignore
import fs from "fs"

describe('DeviceService', () => {

  it('获取浏览器分布数据', async () => {
    const ctx = app.mockContext();
    const req = {
      project_id: 26,
      start_time: '2021-03-26 00:00:00',
      end_time: '2021-03-26 23:59:00',
      type: 'device_engine_name'
    }
    const sourceMapPath = await ctx.service.device.getDeviceStatistics(req)
    console.log(sourceMapPath)
  });
});
