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
      project_id,
      start_time,
      end_time,
    } = par

    const res: any[] = await this.ctx.model.ApiError.findAll({
      where: {
        project_id,
        updatedAt: {
          [Op.gt]: +new Date(start_time),
          [Op.lt]: +new Date(end_time),
        },
      },
      raw: true,
    }) || []

    const list: any = []
    const urlSet = new Set()

    for (const data of res) {
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
    return list

  }
}
