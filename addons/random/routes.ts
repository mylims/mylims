import Route from '@ioc:Adonis/Core/Route'

Route.get('/random', async ({response}) => {
  response.ok({ ok: true })
})
