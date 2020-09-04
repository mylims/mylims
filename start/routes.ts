/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes/index.ts` as follows
|
| import './cart'
| import './customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

import * as fs from 'fs'
import * as path from 'path'

Route.get('/login', async ({ auth }) => {
  const x = await auth.attempt('xavier', '123')
  console.log(x)
})
Route.get('/logged', async ({ auth }) => {
  const user = await auth.authenticate()
  console.log(user)

  return user
})

// Require route from addons
const addons = fs.readdirSync(path.join('..', 'addons'))
addons.map(addon => require(path.join('..', 'addons', addon, 'routes')))
