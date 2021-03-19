import { Service } from 'egg'
import { Op } from 'sequelize'
import dayjs from 'dayjs'

export default class PerformanceService extends Service {
  // 存储设备信息部分
  async create(data) {
    return await this.ctx.model.Performance.create(data)
  }
}
