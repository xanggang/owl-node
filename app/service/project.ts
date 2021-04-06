import { Service } from 'egg'
import { Op } from 'sequelize'

export default class ProjectService extends Service {

  // 新增一个项目
  async create(data) {
    return await this.ctx.model.Project.create(data)
  }

  // 检查一个应用名是否已经存在
  async checkAppName(app_name) {
    const res = await this.ctx.model.Project.findAll({
      where: {
        app_name,
      },
    })
    return Array.isArray(res) && res.length
  }

  // 通过应用名称查询应用详情
  async getOne(app_name) {
    const res = await this.ctx.model.Project.findAll({
      where: {
        app_name,
      },
    })
    if (Array.isArray(res) && res.length) {
      return res[0]
    }
    return null
  }

  // 通过id查询应用详情
  async getOneByAppKey(app_key) {
    const res = await this.ctx.model.Project.findAll({
      where: {
        app_key,
      },
    })
    if (Array.isArray(res) && res.length) {
      return res[0]
    }
    return null
  }

  // 删除
  async deleteProject(id) {
    const project = await this.ctx.model.Project.findByPk(id)
    if (!project) {
      return false
    }
    const logBodys = await this.ctx.model.LogBody.findAll({
      where: { project_id: project.id },
      include: [
        { model: this.ctx.model.LogDetail, raw: true },
      ],
    })

    const logBodyId: any = []
    const logDetailId: any = []
    logBodys.forEach(logBody => {
      logBodyId.push(logBody.id)
      logBody.logDetails.forEach(logDetail => {
        logDetailId.push(logDetail.id)
      })
    })

    try {
      await this.ctx.model.LogDetail.destroy({
        where: {
          id: {
            [Op.in]: logDetailId,
          },
        },
      })
      await this.ctx.model.LogBody.destroy({
        where: {
          id: {
            [Op.in]: logBodyId,
          },
        },
      })
      await project.destroy()
      return true
    } catch (e) {
      this.ctx.logger.error(e)
      return false
    }

  }

  // 根据项目查询时间段内的全部日志， 用于钉钉推送
  async getDayLogs(): Promise<any[]> {
    const { ctx: { model } } = this
    const startTime = +new Date('2021-03-11 11:30:00')
    const endTime = +new Date()

    const res = await model.Project.findAll({
      attributes: [ 'id', 'app_name' ],
      where: {},
      include: [
        {
          model: this.ctx.model.LogBody,
          attributes: [ 'id' ],
          where: {
            updatedAt: {
              [Op.gt]: +new Date(startTime),
              [Op.lt]: +new Date(endTime),
            },
          },
        },
      ],
    })

    if (!res.length) {
      return []
    }

    const data = res.map(project => {
      return {
        name: project.app_name,
        total: project.logBodys.length,
      }
    })

    return data
  }

  // 列表查询
  async getProjectList() {
    return await this.ctx.model.Project.findAll()
  }
}
