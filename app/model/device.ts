export default (app): any => {
  const { INTEGER, TEXT } = app.Sequelize

  const device = app.model.define('device', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    ip: { type: TEXT },
    city: { type: TEXT },
    device_browser_name: { type: TEXT },
    device_browser_version: { type: TEXT },
    device_engine_name: { type: TEXT },
    device_engine_version: { type: TEXT },
    device_os_name: { type: TEXT },
    device_os_version: { type: TEXT },
    pv: { type: INTEGER },
    uv: { type: INTEGER },
  }, {
    timestamps: true,
    raw: true,
  })

  return device
}
