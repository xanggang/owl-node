import { Controller } from 'egg'
import fs from 'fs'
import path from 'path'
import _ from 'lodash'
import { Get, Post, Prefix } from '../decorator/router'
import dayjs from 'dayjs'

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

  @Post('/store')
  public async uploadLog() {
    const { ctx } = this
    const data = ctx.request.body
    const app_name = data.appName

    const project = await this.ctx.service.project.getOne(app_name)
    if (!project) {
      this.ctx.error(null, '应用名不存在, 请先创建对应的应用')
      return
    }

    let err_message,
      err_type,
      error,
      err_content

    const ip = _.get(data, [ 'request', 'url' ])
    const file_path = _.get(data, [ 'transaction' ])

    // 解析错误源码
    const exception = _.get(data, [ 'exception', 'values', 0 ])
    if (exception) {
      err_type = exception.type
      err_message = exception.value
      const frames = _.get(exception, [ 'stacktrace', 'frames' ], [])
      error = frames[frames.length - 1] || {}
    }
    // 解析用户数据
    const userAgent = _.get(data, [ 'request', 'headers', 'User-Agent' ], '')
    const device = await ctx.service.logDetail.getSystemInfo(userAgent)
    const {
      system,
      system_version,
      browser_type,
      browser_version,
      browser_core,
      browser_name,
    } = device
    const hash = await ctx.service.logBody.getHash(err_message, file_path)
    const historyLogs = await ctx.service.logBody.getLogByHash(app_name, hash)
    let historyLog: any = historyLogs[0] || {}
    // 这一条bug以前没有记录过
    if (!historyLogs.length) {
      // 解析bug
      if (file_path && error && error.lineno && error.colno) {
        const sourceMapPath = await this.ctx.service.logBody.getSourceMapPath(app_name, file_path)
        if (sourceMapPath) {
          const sourceMap = fs.readFileSync(sourceMapPath)
          err_content = await ctx.service.logBody.sourceMapDeal(
            sourceMap.toString(),
            error.lineno,
            error.colno, 10)
        }
      }
      // 保存错误体
      historyLog = await ctx.service.logBody.create({
        app_name,
        ip,
        hash,
        system,
        system_version,
        browser_type,
        browser_name,
        browser_version,
        browser_core,
        err_message,
        err_type,
        file_path,
        err_content,
      })
      project.addLogBody(historyLog)
    }

    // const err_id = historyLog.id
    err_content = err_content || historyLog.err_content

    // vue模式， 解析vue组建信息
    // const extra = _.get(data, ['extra', 'componentName'])
    const component_name = _.get(data, [ 'extra', 'componentName' ])
    const props = _.get(data, [ 'extra', 'propsData' ], '')

    const detail = await ctx.service.logDetail.create({
      // log_body_id: err_id,
      ip,
      app_name,
      system,
      system_version,
      browser_type,
      browser_name,
      browser_version,
      browser_core,
      error,
      err_message,
      err_type,
      file_path,
      err_content,
      props: props ? JSON.stringify(props) : '',
      component_name,
    })

    const res = await historyLog.addLogDetails(detail)
    await historyLog.update({ updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss') })

    ctx.body = {
      res,
      app_name,
      ip,

      system,
      system_version,
      browser_type,
      browser_name,
      browser_version,
      browser_core,

      error,
      err_message,
      err_type,
      file_path,
      err_content,
      historyLog,
    }
  }

  @Post('/list')
  public async getList() {
    const {
      page = 1,
      limit = 10,
      startTime,
      endTime,
      app_name,
    } = this.ctx.request.body || {}

    const logBodyList = await this.ctx.service.logBody.getList({
      page,
      limit,
      startTime,
      endTime,
      app_name,
    })

    this.ctx.body = logBodyList

  }
}
