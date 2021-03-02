import { Context } from 'egg'

export interface IResponseData {
  data?: any;
  message?: string;
}

export default {
  setResponseHeader(this: Context) {
    this.ctx.set('Access-Control-Allow-Origin', '*')
    this.ctx.set('Access-Control-Allow-Headers', 'Content-type,Content-Length,Authorization,Accept,X-Requested-Width')
    this.ctx.set('Access-Control-Allow-Methods', 'PUT,POST,GET,DELETE,OPTIONS')
  },
  success(this: Context, response: any, message = 'success') {
    this.status = 200
    this.body = {
      data: response,
      message,
    }
  },
  error(this: Context, response: any, message = 'failure') {
    this.status = 500
    this.body = {
      data: response,
      message,
    }
    console.error(message)
  },
  validator(this: Context, rules: any) {
    try {
      this.validate(rules)
    } catch (err) {
      return err.errors
    }
  },
}
