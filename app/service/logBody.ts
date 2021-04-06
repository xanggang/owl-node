import { Service } from 'egg'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import { Op } from 'sequelize'
import fs from 'fs'
import { ILogBody } from '../model/logBody'
import _ from 'lodash'
import dayjs from 'dayjs'
import { getHash, sourceMapDeal, getSourceMapPath } from '../utils/sourceMap'

export default class LogBodyService extends Service {

  async uploadLog(data) {
    const { app_name, ip } = data
    const project = await this.ctx.service.project.getOne(app_name)

    let err_message,
      err_type,
      error,
      err_content,
      function_name

    const file_path = _.get(data, 'exception.transaction')

    const breadcrumbs = _.get(data, 'userBehavior')

    // 解析错误源码
    const exception = _.get(data, [ 'exception', 'values', 0 ])
    if (exception) {
      err_type = exception.type
      err_message = exception.value
      const frames = _.get(exception, [ 'stacktrace', 'frames' ], [])
      error = frames[frames.length - 1] || {}
      function_name = error.function
    }
    // vue模式， 解析vue组建信息
    const component_name = _.get(data, [ 'vueData', 'componentName' ])
    const props_data = _.get(data, [ 'vueData', 'propsData' ], '')
    // 解析用户数据
    const device = data.device || {}

    const {
      device_os_name,
      device_os_version,
      device_engine_version,
      device_browser_version,
      device_engine_name,
      device_browser_name,
    } = device

    const hash = getHash(err_message, file_path)
    const historyLogs = await this.ctx.service.logBody.getLogByHash(app_name, hash)
    let historyLog: any = historyLogs[0] || {}
    // 这一条bug以前没有记录过
    if (!historyLogs.length) {
      // 解析bug
      if (file_path && error && error.lineno && error.colno) {
        const sourceMapPath = await getSourceMapPath(app_name, file_path)
        if (sourceMapPath) {
          const sourceMap = fs.readFileSync(sourceMapPath)
          err_content = await sourceMapDeal(
            sourceMap.toString(),
            error.lineno,
            error.colno, 1)
        }
      }
      err_content = err_content && err_content.length > 10000 ? 'too long' : err_content
      // 保存错误体
      const saveData: any = {
        app_name,
        ip,
        hash,
        device_os_name,
        device_os_version,
        device_engine_version,
        device_browser_version,
        device_engine_name,
        device_browser_name,
        err_message,
        err_type,
        file_path,
        err_content,
        function_name,
        component_name,
      }
      if (props_data) {
        saveData.props_data = JSON.stringify(props_data)
        saveData.breadcrumbs = JSON.stringify(breadcrumbs)
      }
      historyLog = await this.ctx.service.logBody.create(saveData)
      project.addLogBody(historyLog)
    }
    const detail = await this.ctx.service.logDetail.create({
      ip,
      app_name,
      device_os_name,
      device_os_version,
      device_engine_version,
      device_browser_version,
      device_engine_name,
      device_browser_name,
    })
    const res = await historyLog.addLogDetails(detail)
    await historyLog.update({ updated_at: dayjs().format('YYYY-MM-DD HH:mm:ss') })
    return res
  }

  // 保存错误的主体， 不包含客户端信息
  async create(data: any): Promise<any> {
    return this.ctx.model.LogBody.create({
      ...data,
    })
  }

  // 通过appName和hash查询是否已经存在相同的错误
  async getLogByHash(appName, hash): Promise<Array<ILogBody>> {
    const query = {
      where: {
        app_name: appName,
        hash,
      },
      // raw: true
    }
    return this.ctx.model.LogBody.findAll(query)
  }

  // 查询单个
  async getOne(errId) {
    const log = await this.ctx.model.LogBody.findByPk(errId, {
      include: [ this.ctx.model.LogDetail ],
    })
    return log
  }

  // 分页查询
  public async getList(par) {
    console.log(par)
    const {
      page = 1,
      limit = 10,
      projectId,
      startTime,
      endTime,
      order = 'desc',
    } = par
    const query: any = {
      order: [[ 'created_at', order ], [ 'id', 'desc' ]],
      where: {
        project_id: projectId,
      },
      offset: (page - 1) * limit,
      limit,
      include: [
        { model: this.ctx.model.LogDetail },
      ],
      distinct: true,
    }

    if (startTime || endTime) {
      query.where.updatedAt = {
        [Op.gt]: startTime
          ? +new Date(startTime)
          : +new Date('2020-01-01 00:00:00'),
        [Op.lt]: endTime
          ? +new Date(endTime)
          : +new Date(),
      }
    }
    const logBodyList = await this.ctx.model.LogBody.findAndCountAll(query)

    return logBodyList
  }
}
