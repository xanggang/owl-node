import { Application } from 'egg'
import { getRouter } from './decorator/router'

export default async (app: Application) => {

  getRouter(app, {
    prefix: '/api', // 全局的前缀， 只影响到装饰器写的接口
  })

}
