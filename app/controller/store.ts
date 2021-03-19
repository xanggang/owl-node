import { Controller } from 'egg'
import { Post, Prefix } from '../decorator/router'

@Prefix('/logs')
export default class FileController extends Controller {

  @Post('/store')
  async uploadLog() {
    const { ctx } = this
    // const { api_key } = ctx.request.headers
    const api_key = '123'
    const queue = ctx.request.body || []
    const ip = ctx.request.ip
    const project = await this.ctx.service.project.getOneByAppKey(api_key)
    if (!project) {
      this.ctx.error(null, 'apiKey错误')
      return
    }
    if (!queue.length) return this.ctx.error(null, '')

    try {
      for (const item of queue) {
        const { type, ...res } = item
        const data = { ...res, ip }
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
}
