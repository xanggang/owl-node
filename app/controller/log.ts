import { Controller } from 'egg'
import fs from 'fs'
import path from 'path'
import { Get, Post, Prefix } from '../decorator/router'

@Prefix('/log')
export default class FileController extends Controller {

  @Post('/upload-map')
  public async uploadSourceMap() {
    const stream = this.ctx.req
    const { fileName, apiKey } = this.ctx.query
    const project = await this.ctx.service.project.getOneByAppKey(apiKey)
    if (!project) {
      this.ctx.status = 500
      this.ctx.body = '应用名不存在, 请先创建对应的应用'
      console.error('应用名不存在, 请先创建对应的应用')
      return
    }
    try {
      const dir = path.join('./app/public', project.app_name)
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
      }
      const filePath = path.join('./app/public', project.app_name, fileName)
      const writeStream = fs.createWriteStream(filePath)
      stream.pipe(writeStream)
      this.ctx.body = 'success'
      this.ctx.state = 200

    } catch (e) {
      this.ctx.state = 500
      throw new Error(e)
    }

  }

  @Get('/get')
  public async get() {
    const data = await this.ctx.service.logBody.getOne(this.ctx.query.id)
    this.ctx.success(data)
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
