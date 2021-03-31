import { Service } from 'egg'
import { Op } from 'sequelize'

export default class ApiErrorService extends Service {

  async create(data) {
    return await this.ctx.model.ApiError.create(data)
  }

  // 分组求和
  // todo 通过sql实现
  async getApiErrorsStatistics(par) {
    const {
      page = 1,
      limit = 10,
      project_id,
      start_time,
      end_time,
      order = 'desc',
    } = par

    const res: any = await this.ctx.model.ApiError.findAndCountAll({
      order: [[ 'created_at', order ], [ 'id', 'desc' ]],
      where: {
        project_id,
        updatedAt: {
          [Op.gt]: +new Date(start_time),
          [Op.lt]: +new Date(end_time),
        },
      },
      limit,
      offset: (page - 1) * limit,
      raw: true,
      distinct: true,
    })

    const list: any = []
    const urlSet = new Set()
    if (!res.rows?.length) {
      return {
        rows: [],
        count: 0,
      }
    }

    for (const data of res.rows) {
      const url = data.url
      if (urlSet.has(url)) {
        continue
      }
      urlSet.add(url)
      const count = await this.ctx.model.ApiError.count({
        where: {
          project_id,
          updatedAt: {
            [Op.gt]: +new Date(start_time),
            [Op.lt]: +new Date(end_time),
          },
          url,
        },
        raw: true,
      })
      data.count = count
      list.push(data)
    }
    return {
      rows: list,
      count: list.length,
    }
  }

  async getApiDetail(id) {
    const log = await this.ctx.model.ApiError.findByPk(id)
    return log
  }
}
