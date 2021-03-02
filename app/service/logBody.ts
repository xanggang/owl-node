import { Service } from 'egg'
import { SourceMapConsumer } from 'source-map'
// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
import sha256 from 'sha256'
import { Op } from 'sequelize'
import path from 'path'
import fs from 'fs'
import { ILogBody } from '../model/logBody'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
SourceMapConsumer.initialize({
  'lib/mappings.wasm': 'https://unpkg.com/source-map@0.7.3/lib/mappings.wasm',
})

/**
 * 转义html标签。 否则vue无法展示
 * @param sHtml string
 */
function html2Escape(sHtml: string | undefined) {
  if (typeof sHtml !== 'string') {
    return sHtml
  }
  return sHtml.replace(/[<>&"]/g, function(c) {
    return { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;' }[c]
  })
}

export default class LogBodyService extends Service {

  // 通过错误信息和错误的文件计算哈希
  async getHash(msg, file) {
    return sha256(msg + file)
  }

  // 保存错误的主体， 不包含客户端信息
  async create(data: any): Promise<any> {
    return this.ctx.model.LogBody.create({
      ...data,
    })
  }

  // 通过appName和hash查询是否已经存在相同的错误
  async getLogByHash(appName, hash): Promise<Array<ILogBody>> {
    const query = {
      where: {
        app_name: appName,
        hash,
      },
      // raw: true
    }
    return this.ctx.model.LogBody.findAll(query)
  }

  // 读取sourceMap路径
  async getSourceMapPath(appName: string, file_path: string): Promise<string | null> {
    const file_name = path.basename(file_path) + '.map'
    const sourceMapPath = path.join('./app/public', appName, file_name)
    if (fs.existsSync(sourceMapPath)) {
      return sourceMapPath
    }
    return null
  }

  // 解析sourceMap 返回编译前的源码
  async sourceMapDeal(rawSourceMap: any, line, column, offset = 5): Promise<string> {
    // 通过sourceMap库转换为sourceMapConsumer对象
    const consumer = await new SourceMapConsumer(rawSourceMap)
    // 传入要查找的行列数，查找到压缩前的源文件及行列数
    const sm: any = consumer.originalPositionFor({
      line, // 压缩后的行数
      column, // 压缩后的列数
    })
    // 压缩前的所有源文件列表
    const { sources } = consumer
    // 根据查到的source，到源文件列表中查找索引位置
    const smIndex = sources.indexOf(sm.source)
    // 到源码列表中查到源代码
    const smContent = consumer.sourcesContent[smIndex]
    // 将源代码串按"行结束标记"拆分为数组形式
    const rawLines = smContent.split(/\r?\n/g)

    let begin = sm.line - offset
    const end = sm.line + offset + 1
    begin = begin < 0 ? 0 : begin

    let stringList = ''

    for (let i = begin; i <= end; i++) {
      const code = html2Escape(rawLines[i])
      if (i === sm.line - 1) {
        stringList += `<code class="red"><pre>${code} </pre></code>`
      } else {
        stringList += rawLines[i] ? `<code><pre>${code} </pre></code>` : ''
      }
    }

    // 记得销毁
    consumer.destroy()
    return stringList
  }

  // 查询单个
  async getOne(errId) {
    const log = await this.ctx.model.LogBody.findByPk(errId, {
      include: [ this.ctx.model.LogDetail ],
    })
    return log
  }

  // 分页查询
  public async getList(par) {
    console.log(par)
    const {
      page = 1,
      limit = 10,
      app_name,
      startTime,
      endTime,
      order = 'desc',
    } = par
    const query: any = {
      order: [[ 'created_at', order ], [ 'id', 'desc' ]],
      where: {
        app_name,
      },
      offset: (page - 1) * limit,
      limit,
      include: [
        { model: this.ctx.model.LogDetail },
      ],
      distinct: true,
    }

    if (startTime || endTime) {
      query.where.updatedAt = {
        [Op.gt]: startTime
          ? +new Date(startTime)
          : +new Date('2020-01-01 00:00:00'),
        [Op.lt]: endTime
          ? +new Date(endTime)
          : +new Date(),
      }
    }
    const logBodyList = await this.ctx.model.LogBody.findAndCountAll(query)

    return logBodyList
  }

}
