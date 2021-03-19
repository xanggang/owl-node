import { Service } from 'egg'

export default class ApiErrorService extends Service {

  async create(data) {
    return await this.ctx.model.ApiError.create(data)
  }
}
