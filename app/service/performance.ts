import { Service } from 'egg'
import { Op, fn, col } from 'sequelize'

export default class PerformanceService extends Service {
  // 存储设备信息部分
  async create(data) {
    return await this.ctx.model.Performance.create(data)
  }

  // 查询时间段内的性能平均值
  async getPerformanceAvg(par: any) {
    const {
      project_id,
      start_time,
      end_time,
    } = par
    return this.ctx.model.Performance.findAll({
      where: {
        project_id,
        updatedAt: {
          [Op.gt]: +new Date(start_time),
          [Op.lt]: +new Date(end_time),
        },
      },
      attributes: [
        [ fn('AVG', col('load_page')), 'load_page' ],
        [ fn('AVG', col('dom_ready')), 'dom_ready' ],
        [ fn('AVG', col('redirect')), 'redirect' ],
        [ fn('AVG', col('lookup_domain')), 'lookup_domainAvg' ],
        [ fn('AVG', col('ttfb')), 'ttfb' ],
        [ fn('AVG', col('request')), 'request' ],
        [ fn('AVG', col('load_event')), 'load_event' ],
        [ fn('AVG', col('appcache')), 'appcache' ],
        [ fn('AVG', col('connect')), 'connect' ],
      ],
      raw: true,
    })
  }

}
