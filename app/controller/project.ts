import { Controller } from 'egg'
import { Get, Post, Prefix, Delete } from '../decorator/router'
import sha256 from 'sha256'

@Prefix('/project')
export default class ProjectController extends Controller {

  @Post('/create')
  public async create() {
    const { ctx } = this
    const {
      app_name,
      host,
    } = ctx.request.body
    const isErr = await this.ctx.service.project.checkAppName(app_name)
    if (isErr) {
      this.ctx.error(null, '应用名已被占用')
      return
    }
    const app_key = sha256(+new Date())
    const res = await this.ctx.service.project.create({
      app_name,
      app_key,
      host,
    })

    ctx.body = res
  }

  @Delete('/delete')
  public async deleteProject() {
    const id = this.ctx.query.id
    const res = await this.ctx.service.project.deleteProject(id)
    if (!res) {
      this.ctx.error(null, '删除失败')
      return
    }
    this.ctx.success(null, '删除成功')
  }

  @Get('/getDay')
  public async getDay() {
    this.ctx.body = await this.ctx.service.project.getDayLogs()
  }

  @Get('/list')
  public async getProjectList() {
    this.ctx.body = await this.ctx.service.project.getProjectList()
  }

}
