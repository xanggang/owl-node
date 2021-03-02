export default (app): any => {
  const { INTEGER, CHAR } = app.Sequelize

  const project = app.model.define('project', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    host: { type: CHAR },
    app_name: { type: CHAR },
    app_key: { type: CHAR },
  }, {
    timestamps: true,
    raw: true,
  })

  project.associate = function() {
    app.model.Project.hasMany(app.model.LogBody)
  }

  return project
}
