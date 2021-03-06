export interface ILogBody {
  id: number;
  hash: string;
  appName: string;
  file_path?: string;
  err_message?: string;
  err_content?: string;
  err_type?: string;
  created_at: string;
  updated_at: string;
}

export interface ILogBodyCreate {
  app_name: string;
  ip: string;
  hash: string;
  system?: string;
  system_version?: string;
  browser_type?: string;
  browser_name?: string;
  browser_version?: string;
  browser_core?: string;

  err_message?: string;
  err_type?: string;
  file_path?: string;
  err_content?: string;
}

// 每一个错误的错误内容
export default (app): any => {
  const { INTEGER, CHAR, TEXT } = app.Sequelize

  const logBodyModel = app.model.define('logBodys', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    hash: { type: CHAR },
    project_id: { type: INTEGER },
    app_name: { type: CHAR },
    file_path: { type: CHAR },
    err_message: { type: CHAR },
    function_name: { type: CHAR },
    err_content: { type: TEXT },
    err_type: { type: TEXT },
    component_name: { type: CHAR },
    props_data: { type: CHAR },

    ip: { type: CHAR },
    device_os_name: { type: CHAR },
    device_os_version: { type: CHAR },
    device_engine_version: { type: CHAR },
    device_browser_version: { type: CHAR },
    device_engine_name: { type: CHAR },
    device_browser_name: { type: CHAR },
    breadcrumbs: { type: TEXT },
  }, {
    timestamps: true,
    raw: false,
  })

  logBodyModel.associate = function() {
    app.model.LogBody.hasMany(app.model.LogDetail)
    app.model.LogBody.belongsTo(app.model.Project)
  }

  return logBodyModel
}
