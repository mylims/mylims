import Route from '@ioc:Adonis/Core/Route'

Route.get('/login', async ({ auth }) => {
  const x = await auth.attempt('user02', 'bitnami2')
  console.log(x)
  return { test: true }
})

Route.get('/user', async ({ auth }) => {
  console.log(auth.user)
}).middleware('auth')
