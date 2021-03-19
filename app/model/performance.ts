export default (app): any => {
  const { INTEGER, TEXT, DOUBLE } = app.Sequelize

  const device = app.model.define('performance', {
    id: { type: INTEGER, primaryKey: true, autoIncrement: true },
    ip: { type: TEXT },
    load_page: { type: DOUBLE },
    dom_ready: { type: DOUBLE },
    redirect: { type: DOUBLE },
    lookup_domain: { type: DOUBLE },
    ttfb: { type: DOUBLE },
    request: { type: DOUBLE },
    load_event: { type: DOUBLE },
    appcache: { type: DOUBLE },
    connect: { type: DOUBLE },
  }, {
    timestamps: true,
    raw: true,
  })

  return device
}
