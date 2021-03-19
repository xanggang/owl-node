
export default (app): any => {
  const { INTEGER, CHAR, TEXT } = app.Sequelize

  const logDetail = app.model.define('logDetails', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    log_body_id: { type: INTEGER },
    app_name: { type: CHAR },
    ip: { type: CHAR },
    device_os_name: { type: CHAR },
    device_os_version: { type: CHAR },
    device_engine_version: { type: CHAR },
    device_browser_version: { type: CHAR },
    device_engine_name: { type: CHAR },
    device_browser_name: { type: CHAR },
    err_type: { type: TEXT },
  }, {
    timestamps: true,
    raw: true,
  })

  logDetail.associate = function() {
    app.model.LogDetail.belongsTo(app.model.LogBody)
  }

  return logDetail
}
