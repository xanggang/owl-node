import { Service } from 'egg'
import { col, fn, Op } from 'sequelize'
import dayjs from 'dayjs'

export default class DeviceService extends Service {
  // 存储设备信息部分
  async create(data) {
    const { ip } = data
    const res = await this.checkToDayIsSave(ip)
    // if (!res) return true
    return await this.ctx.model.Device.create({
      ...data,
      pv: 1,
      uv: 1,
    })
  }

  // 通过ip和时间查询数据
  async getDataByIp(ip, startTime?: string, endTime?: string) {
    const query: any = {
      where: {
        ip,
      },
      updatedAt: {},
    }
    if (startTime) {
      query.where.updatedAt = {
        [Op.gt]: +new Date(startTime),
      }
    }
    if (endTime) {
      Object.assign(query.where.updatedAt, {
        [Op.lt]: +new Date(endTime),
      })
    }
    const res = await this.ctx.model.Device.findAll(query)
    if (Array.isArray(res) && res.length) {
      return res[0]
    }
    return null
  }

  // 判断同一天内是否记录过， 记录过pv+1 没有记录过uv+1
  async checkToDayIsSave(ip) {
    const res = await this.getDataByIp(ip, dayjs().format('YYYY-MM-DD'))
    // 如果没有保存过记录
    if (!res) return true
    res.pv++
    res.save()
    return false
  }

  // 通过ip获取城市
  async getCityName() {
    //
  }

  // 查询一个阶段内的全部统计数据
  async getDeviceStatistics(par) {
    const {
      project_id,
      start_time,
      end_time,
      type,
    } = par
    return this.ctx.model.Device.findAll({
      where: {
        project_id,
        updatedAt: {
          [Op.gt]: +new Date(start_time),
          [Op.lt]: +new Date(end_time),
        },
      },
      group: type,
      attributes: [
        type,
        [ fn('SUM', col('pv')), 'pv' ],
      ],
      raw: true,
    })
  }
}
