
export default (app): any => {
  const { INTEGER, CHAR, TEXT } = app.Sequelize

  const logDetail = app.model.define('logDetails', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    log_body_id: { type: INTEGER },
    app_name: { type: CHAR },
    ip: { type: CHAR },
    system: { type: CHAR },
    system_version: { type: CHAR },
    browser_name: { type: CHAR },
    browser_version: { type: CHAR },
    browser_type: { type: CHAR },
    browser_core: { type: CHAR },
    file_path: { type: CHAR },
    err_message: { type: CHAR },
    err_content: { type: TEXT },
    component_name: { type: CHAR },
    props: { type: CHAR },
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
