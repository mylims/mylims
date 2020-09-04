import Route from '@ioc:Adonis/Core/Route'

Route.get('/login', async ({ auth }) => {
  return auth.attempt('user01', 'bitnami1')
})

Route.get('/user', async ({ auth }) => {
  return auth.authenticate()
})
