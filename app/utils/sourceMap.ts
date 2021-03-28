import sha256 from 'sha256'
import { SourceMapConsumer } from 'source-map'
import path from 'path'
import fs from 'fs'

// eslint-disable-next-line @typescript-eslint/ban-ts-ignore
// @ts-ignore
SourceMapConsumer.initialize({
  'lib/mappings.wasm': 'https://unpkg.com/source-map@0.7.3/lib/mappings.wasm',
})

/**
 * 通过错误信息和错误的文件计算哈希
 * @param msg
 * @param file
 */
export function getHash(msg: string, file: string): string {
  return sha256(msg + file)
}

/**
 * 转义html标签。 否则vue无法展示
 * @param sHtml string
 */
function html2Escape(sHtml: string | undefined) {
  if (typeof sHtml !== 'string') {
    return sHtml
  }
  return sHtml.replace(/[<>&"]/g, function(c) {
    return {
      '<': '&lt;',
      '>': '&gt;',
      '&': '&amp;',
      '"': '&quot;',
    }[c]
  })
}

/**
 * 解析sourceMap 返回编译前的源码
 * @param rawSourceMap
 * @param line
 * @param column
 * @param offset
 */
export async function sourceMapDeal(rawSourceMap: any, line, column, offset = 5): Promise<string> {
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

// 读取sourceMap路径
export async function getSourceMapPath(appName: string, file_path: string): Promise<string | null> {
  const file_name = path.basename(file_path) + '.map'
  const sourceMapPath = path.join('./app/public', appName, file_name)
  if (fs.existsSync(sourceMapPath)) {
    return sourceMapPath
  }
  return null
}
