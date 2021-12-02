import { Subscription } from 'egg'

function getMessage(data: any[]) {
  let st = '#### **前端业务通知**\n'
  data.forEach(item => {
    st += `***\n**项目名称**：${item.name}\n\n**错误数量**：${item.total}\n***\n`
  })
  st += '[查看详情](http://owl-web.lynn.cool)'
  return st
}


class UpdateCache extends Subscription {
  // 通过 schedule 属性来设置定时任务的执行间隔等配置
  static get schedule() {
    return {
      cron: '0 0 18 * * *', // 每天18点执行
      type: 'worker', // 每台机器上只有一个 worker 会执行这个定时任务，每次执行定时任务的 worker 的选择是随机的。
      disable: true
    }
  }

  // subscribe 是真正定时任务执行时被运行的函数
  async subscribe() {
    console.info('定时任务启动')
    try {
      const data = await this.ctx.service.project.getDayLogs()
      const res = await this.sendMessage(getMessage(data))
      console.info(res)
    } catch (e) {
      console.error('定时任务运行失败，请检查')
      console.error(e)
    }
  }

  async sendMessage(string: string) {
    const url = 'https://oapi.dingtalk.com/robot/send?access_token=ad491c0456aa869b96128a13dd8b6aa61120567aae6b6e6bc255de96008cab2e'
    return await this.app.curl(url, {
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
