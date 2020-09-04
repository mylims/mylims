import Route from '@ioc:Adonis/Core/Route'

Route.get('/login', async ({ auth }) => {
  return auth.attempt('xavier', '123')
})

Route.get('/user', async ({ auth }) => {
  return auth.authenticate()
})
