import { app } from 'egg-mock/bootstrap';
// import assert from 'assert'
// @ts-ignore
import fs from "fs"

describe('logBody', () => {
  // it('通过错误信息和错误的文件计算哈希', async () => {
  //   const ctx = app.mockContext();
  //   const hash1 = await ctx.service.logBody.getHash('message1', 'error1')
  //   const hash2 = await ctx.service.logBody.getHash('message2', 'error2')
  //   assert(typeof hash1 === 'string')
  //   assert(typeof hash2 === 'string')
  //   assert(hash1 !== hash2)
  // });
  //
  // it('解析map文件', async () => {
  //   const ctx = app.mockContext();
  //   // let path = 'http://127.0.0.1:3000/js/chunk-vendors.28f749af.js'
  //   let path = 'http://127.0.0.1:3000/js/app.4b267422.js'
  //   // let path = 'http://127.0.0.1:3000/js/about.3f80419f.js'
  //   const sourceMapPath = await ctx.service.logBody.getSourceMapPath('owl-view', path)
  //   if (!sourceMapPath) {
  //     throw new Error('sourceMapPath')
  //   }
  //   const sourceMap = fs.readFileSync(sourceMapPath)
  //   const err_content = await ctx.service.logBody.sourceMapDeal(
  //     sourceMap.toString(),
  //     7,
  //     67321, 10)
  // });

  it('获取远程的map文件', async function (){
    const ctx = app.mockContext();
    this.timeout(10000);
    const testPath = 'http://owl-web.lynn.cool/js/about.c539bd9c.js'
    const sourceMapPath = await ctx.service.logBody.getErrorContent(testPath)
    // const err_content = await ctx.service.logBody.sourceMapDeal(
    //   sourceMapPath.toString(),
    //   7,
    //   67321, 10)

    console.log(sourceMapPath)
  });
});
