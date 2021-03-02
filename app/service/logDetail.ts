import { Service } from 'egg'
import UA from 'ua-device'
import _ from 'lodash'


export default class LogDetailService extends Service {

  // 解析用户系统信息
  async getSystemInfo(userAgent) {
    const device = new UA(userAgent)

    // 操作系统
    const system = _.get(device, [ 'os', 'name' ])
    // 操作系统版本
    const system_version = _.get(device, [ 'os', 'version', 'original' ])
    // 浏览器类型
    const browser_type = _.get(device, [ 'browser', 'channel' ])
    // 浏览器名称
    const browser_name = _.get(device, [ 'browser', 'name' ])
    // 浏览器版本
    const browser_version = _.get(device, [ 'browser', 'version', 'original' ])
    // 浏览器核心
    const browser_core = _.get(device, [ 'engine', 'name' ])

    return {
      system,
      system_version,
      browser_type,
      browser_name,
      browser_version,
      browser_core,
    }
  }

  // 存储错误的客户端消息
  async create(data) {
    return this.ctx.model.LogDetail.create({
      ...data,
    })
  }

  // 查询某一个错误的错误分布
  async getDetail(errId) {
    return this.ctx.model.LogDetail.findAll({
      where: { errId },
    })
  }
}
