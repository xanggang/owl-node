import { Service } from 'egg'
import { Op } from 'sequelize'

export default class ProjectService extends Service {

  async create(data) {
    return await this.ctx.model.Project.create(data)
  }

  async checkAppName(app_name) {
    const res = await this.ctx.model.Project.findAll({
      where: {
        app_name,
      },
    })
    return Array.isArray(res) && res.length
  }

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
    const startTime = +new Date('2020-08-11 11:30:00')
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

  async getProjectList() {
    return await this.ctx.model.Project.findAll()
  }
}
