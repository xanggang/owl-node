import { Controller } from 'egg'
import { Get, Post, Prefix, Delete } from '../decorator/router'
import { v4 as uuidv4 } from 'uuid'

@Prefix('/project')
export default class ProjectController extends Controller {

  // 创建一个应用
  @Post('/create')
  public async create() {
    const {
      app_name,
    } = this.ctx.request.body
    const isErr = await this.ctx.service.project.checkAppName(app_name)
    if (isErr) {
      this.ctx.error(null, '应用名已被占用')
      return
    }
    const app_key = uuidv4()
    const res = await this.ctx.service.project.create({
      app_name,
      app_key,
    })
    this.ctx.success(res, '创建成功')
  }

  //  删除
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

  // 查询当天的项目错误情况， 用于当天的定时任务推送
  @Get('/getDay')
  public async getDay() {
    const res = await this.ctx.service.project.getDayLogs()
    this.ctx.success(res)
  }

  // 查询全部的应用
  @Get('/list')
  public async getProjectList() {
    const res = await this.ctx.service.project.getProjectList()
    this.ctx.success(res)
  }
}
