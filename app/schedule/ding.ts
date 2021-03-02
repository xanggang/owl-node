import { Subscription } from 'egg'

// function getMessage(data: any[]) {
//   let st = '#### **前端业务通知**\n'
//   data.forEach(item => {
//     st += `***\n**项目名称**：${item.name}\n\n**错误数量**：${item.total}\n***\n`
//   })
//   st += '[查看详情](http://name.com)'
//   return st
// }


class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      interval: '10000S', // 1 分钟间隔
      type: 'worker', // 指定所有的 worker 都需要执行
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    // const data = await this.ctx.service.project.getDayLogs()
    // const res = await this.sendMessage(getMessage(data))
  }

  async sendMessage(string: string) {
    const url = 'https://oapi.dingtalk.com/robot/send?access_token=cb2e4eff8e6e96892165c54d846e58a376e8996e05aa6da62d9aa0d38812e7f5'
    await this.app.curl(url, {
      method: 'POST',
      contentType: 'json',
      dataType: 'json',
      data: {
        markdown: {
          title: '前端业务通知',
          text: string,
        },
        msgtype: 'markdown',
      },
    })
  }

}

module.exports = UpdateCache
