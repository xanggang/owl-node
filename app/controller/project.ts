import { Controller } from 'egg'
import { Get, Post, Prefix, Delete } from '../decorator/router'
import uuid from 'uuid'

@Prefix('/project')
export default class ProjectController extends Controller {

  @Post('/create')
  public async create() {
    const { ctx } = this
    const {
      app_name,
    } = ctx.request.body
    const isErr = await this.ctx.service.project.checkAppName(app_name)
    if (isErr) {
      this.ctx.error(null, '应用名已被占用')
      return
    }
    const app_key = uuid()
    const res = await this.ctx.service.project.create({
      app_name,
      app_key,
    })
    ctx.success(res, '创建成功')
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
    const res = await this.ctx.service.project.getDayLogs()
    this.ctx.success(res)
  }

  @Get('/list')
  public async getProjectList() {
    const res = await this.ctx.service.project.getProjectList()
    this.ctx.success(res)
  }

}
