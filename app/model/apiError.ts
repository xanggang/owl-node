export default (app): any => {
  const { INTEGER, TEXT } = app.Sequelize

  const device = app.model.define('apiErrors', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    ip: { type: TEXT },
    project_id: { type: INTEGER },
    headers: { type: TEXT },
    request: { type: TEXT },
    request_time: { type: TEXT },
    response: { type: TEXT },
    status: { type: TEXT },
    url: { type: TEXT },
  }, {
    timestamps: true,
    raw: true,
  })

  return device
}
