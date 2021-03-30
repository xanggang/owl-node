import { Application } from 'egg'

export default class AppBootHook {
  app: Application

  constructor(app: Application) {
    this.app = app

    console.log('PROD_MY_SQL_HOST', process.env.PROD_MY_SQL_HOST)
    console.log('PROD_MY_SQL_PASSWORD', process.env.PROD_MY_SQL_PASSWORD)
    console.log('PROD_MY_SQL_PORT', process.env.PROD_MY_SQL_HOST)
  }
}
