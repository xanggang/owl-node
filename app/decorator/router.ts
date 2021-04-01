import { Application } from 'egg'
import 'reflect-metadata'

const METHOD_METADATA = 'method'
const PATH_METADATA = 'path'
const PREFIX_METADATA = 'prefix'
const MIDDLEWARE_METADATA = 'middleware'
const map = new Map()

const createMappingDecorator = (method: string) =>
  (path: string, middlewareList?: any[]): MethodDecorator => {
    return (target: Record<string, any>, key: any, descriptor: PropertyDescriptor) => { // target 类的原型
      // descriptor.value 被修饰的方法
      // target 类的原型
      map.set(target, target)
      // 在target上添加了{path: path}
      Reflect.defineMetadata(PATH_METADATA, path, descriptor.value)
      // 在target添加了{method: method}
      Reflect.defineMetadata(METHOD_METADATA, method, descriptor.value)

      if (middlewareList && Array.isArray(middlewareList) && middlewareList.length) {
        Reflect.defineMetadata(MIDDLEWARE_METADATA, middlewareList, descriptor.value)
      }
    }
  }

function getRouter(app: Application, options: any = {}) {
  const globalPrefix = options.prefix || ''

  map.forEach((value: any) => {
    const propertyNames = Object.getOwnPropertyNames(value)
      .filter(pName => pName !== 'constructor' && pName !== 'pathName' && pName !== 'fullPath')

    const prefix = Reflect.getMetadata(PREFIX_METADATA, value) || ''

    propertyNames.forEach(name => {
      const reqMethod = Reflect.getMetadata(METHOD_METADATA, value[name])
      const path = Reflect.getMetadata(PATH_METADATA, value[name])
      const middlewareList = Reflect.getMetadata(MIDDLEWARE_METADATA, value[name]) || []
      if (!reqMethod || !path) return
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const controller = async (ctx, next: any) => {
        // value 每个控制器的原型
        // value.constructor 控制器， controller
        const instance = new value.constructor(ctx)

        await instance[name](ctx)
      }

      app.router[reqMethod](globalPrefix + prefix + path, ...middlewareList, controller)
    })


  })

}

// 类的装饰器，
const Prefix = (path: string): ClassDecorator => {
  // 类本身
  return (target: any) => {
    Reflect.defineMetadata(PREFIX_METADATA, path, target.prototype)
  }
}

const Get = createMappingDecorator('get')
const Post = createMappingDecorator('post')
const Put = createMappingDecorator('put')
const Delete = createMappingDecorator('delete')
const Options = createMappingDecorator('options')


export {
  Get,
  Post,
  Put,
  Delete,
  Prefix,
  Options,
  getRouter,
}
