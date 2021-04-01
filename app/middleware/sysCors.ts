
export default async function(ctx, next) {
  ctx.set('Access-Control-Allow-Origin', '*')
  await next()
}
