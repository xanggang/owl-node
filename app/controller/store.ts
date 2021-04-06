import { Controller } from 'egg'
import { Post, Get, Prefix } from '../decorator/router'
import dayjs from 'dayjs'
import sysCors from '../middleware/sysCors'

@Prefix('/logs')
export default class FileController extends Controller {

  @Post('/store', [ sysCors ])
  async uploadLog() {
    const apikey = this.ctx.request?.header['owl-api-key']
    if (!apikey) {
      this.ctx.error(null, 'apiKey错误， 请确认')
      return
    }
    const queue = this.ctx.request.body || []
    const ip = this.ctx.request.ip
    const project = await this.ctx.service.project.getOneByAppKey(apikey)
    if (!project) {
      this.ctx.error(null, 'apiKey错误')
      return
    }
    if (!queue.length) return this.ctx.error(null, '')

    try {
      for (const item of queue) {
        const { type, ...res } = item
        const data = { ...res, ip, project_id: project.id }
        if (type === 'device') {
          await this.ctx.service.device.create(data)
        } else if (type === 'performance') {
          await this.ctx.service.performance.create(data)
        } else if (type === 'api') {
          await this.ctx.service.apiError.create(data)
        } else if (type === 'error') {
          await this.ctx.service.logBody.uploadLog({ ...data, app_name: project.app_name, ip })
        }
      }
    } catch (err) {
      console.error(err)
      this.ctx.error(err)
    }
    this.ctx.success('ok')
  }

  /**
   * 获取性能平均值
   */
  @Get('/performanceAvg')
  async performanceAvg() {
    const validator = this.ctx.validator({
      projectId: { required: true },
      startTime: { required: true },
      endTime: { required: true },
    }, this.ctx.query)
    if (validator) {
      this.ctx.error(validator, '参数校验错误')
      return
    }
    const query = this.ctx.query || {}
    const { projectId, startTime, endTime } = query
    const isMoreThen30 = dayjs(endTime).subtract(30, 'day').isAfter(dayjs(startTime))
    if (isMoreThen30) {
      return this.ctx.error(null, '查询时间不能大于30天')
    }
    const res = await this.service.performance.getPerformanceAvg({
      project_id: projectId,
      start_time: startTime,
      end_time: endTime,
    })
    this.ctx.success(res)
  }

  /**
   * 查询设备分布
   */
  @Get('/deviceStatistics')
  async deviceStatistics() {
    const validator = this.ctx.validator({
      projectId: { required: true },
      startTime: { required: true },
      endTime: { required: true },
      type: { required: true },
    }, this.ctx.query)
    if (validator) {
      this.ctx.error(validator, '参数校验错误')
      return
    }
    const query = this.ctx.query || {}
    const { projectId, startTime, endTime, type } = query
    const isMoreThen30 = dayjs(endTime).subtract(30, 'day').isAfter(dayjs(startTime))
    if (isMoreThen30) {
      return this.ctx.error(null, '查询时间不能大于30天')
    }
    const res = await this.service.device.getDeviceStatistics({
      project_id: projectId,
      start_time: startTime,
      end_time: endTime,
      type,
    })
    this.ctx.success(res)
  }

  /**
   * 查询api错误分布
   */
  @Get('/apiErrorsStatistics')
  async apiErrorsStatistics() {
    const validator = this.ctx.validator({
      projectId: { required: true },
      startTime: { required: true },
      endTime: { required: true },
    }, this.ctx.query)
    if (validator) {
      this.ctx.error(validator, '参数校验错误')
      return
    }
    const query = this.ctx.query || {}
    const { projectId, startTime, endTime } = query
    const isMoreThen30 = dayjs(endTime).subtract(30, 'day').isAfter(dayjs(startTime))
    if (isMoreThen30) {
      return this.ctx.error(null, '查询时间不能大于30天')
    }
    const res = await this.service.apiError.getApiErrorsStatistics({
      project_id: projectId,
      start_time: startTime,
      end_time: endTime,
    })
    this.ctx.success(res)
  }

  /**
   * 查询api错误详情
   */
  @Get('/apiErrorsDetail')
  async apiErrorDetail() {
    const id = this.ctx.query.id
    if (!id) {
      return this.ctx.error(null, 'id is require')
    }
    const res = await this.service.apiError.getApiDetail(id)
    this.ctx.success(res)
  }
}
