import { EggAppConfig, EggAppInfo, PowerPartial } from 'egg'
import self from '../self.json'
// const self: any = {
//   qiniu: {},
//   mysql: {
//     address: '100.100.1.100',
//     password: 'password',
//   },
//   dingtalk: {},
//   secret: {},
// }

export default (appInfo: EggAppInfo) => {
  const config = {} as PowerPartial<EggAppConfig>

  // override config from framework / plugin
  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1596444623473_2349'

  // add your egg config in here
  config.middleware = []

  config.cors = {
    origin: '*',
    allowMethods: 'GET,HEAD,PUT,POST,DELETE,PATCH',
  }

  config.security = {
    csrf: {
      ignoreJSON: true, // 默认为 false，当设置为 true 时，将会放过所有 content-type 为 `application/json` 的请求
      enable: false,
    },
    xframe: {
      enable: true,
      value: 'ALLOW-FROM',
    },
  }

  config.sequelize = {
    dialect: 'mysql',
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    host: self.mysql.address,
    password: self.mysql.password,
    port: 9006,
    database: 'owl',
    timezone: '+08:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  }

  // @ts-ignore
  config.qiniu = self.qiniu

  // add your special config in here
  const bizConfig = {
    sourceUrl: `https://github.com/eggjs/examples/tree/master/${appInfo.name}`,
  }

  // the return config will combines to EggAppConfig
  return {
    ...config,
    ...bizConfig,
  }
}
