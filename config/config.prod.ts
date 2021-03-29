import { EggAppConfig, PowerPartial } from 'egg'

export default () => {
  const config: PowerPartial<EggAppConfig> = {}

  config.sequelize = {
    dialect: 'mysql',
    // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
    // @ts-ignore
    host: process.env.PROD_MY_SQL_HOST,
    password: process.env.PROD_MY_SQL_PASSWORD,
    port: process.env.PROD_MY_SQL_PORT ? Number(process.env.PROD_MY_SQL_PORT) : undefined,
    database: 'owl',
    timezone: '+08:00',
    dialectOptions: {
      dateStrings: true,
      typeCast: true,
    },
  }

  return config
}
