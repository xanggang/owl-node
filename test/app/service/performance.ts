import { app } from 'egg-mock/bootstrap';
// import assert from 'assert'
// @ts-ignore
import fs from "fs"

describe('Performance', () => {

  it('获取性能平均值', async () => {
    const ctx = app.mockContext();
    const req = {
      projectId: 26,
      startTime: '2021-03-26 00:00:00',
      endTime: '2021-03-26 23:59:00'
    }
    const sourceMapPath = await ctx.service.performance.getPerformanceAvg(req)
    console.log(sourceMapPath)
  });
});
