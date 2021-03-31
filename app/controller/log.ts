import { Controller } from 'egg'
import fs from 'fs'
import path from 'path'
import { Get, Post, Prefix } from '../decorator/router'

@Prefix('/log')
export default class FileController extends Controller {

  @Post('/upload-map')
  public async uploadSourceMap() {
    const { ctx } = this
    const stream = ctx.req
    const { fileName, appName } = this.ctx.query
    const isRepeat = await this.ctx.service.project.checkAppName(appName)
    if (!isRepeat) {
      ctx.status = 500
      ctx.body = '应用名不存在, 请先创建对应的应用'
      console.error('应用名不存在, 请先创建对应的应用')
      return
    }
    try {
      const dir = path.join('./app/public', appName)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      const filePath = path.join('./app/public', appName, fileName)
      const writeStream = fs.createWriteStream(filePath)
      stream.pipe(writeStream)
      ctx.body = 'success'
      ctx.state = 200

    } catch (e) {
      ctx.state = 500
      throw new Error(e)
    }

  }

  @Get('/get')
  public async get() {
    const { ctx } = this
    const data = await ctx.service.logBody.getOne(ctx.query.id)
    ctx.body = data || {}
  }

  @Post('/list')
  public async getList() {
    const {
      page = 1,
      limit = 10,
      startTime,
      endTime,
      projectId,
    } = this.ctx.request.body || {}

    const logBodyList = await this.ctx.service.logBody.getList({
      page,
      limit,
      startTime,
      endTime,
      projectId,
    })
    this.ctx.success(logBodyList)
  }
}
