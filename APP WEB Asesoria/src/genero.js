import {  GeneroController } from '../controllers/genero.controller'
import { APIModel } from '../models/api.model'
import { GeneroView } from '../views/genero.view'

const main = () => {
  const model = new APIModel()
  const controller = new GeneroController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new GeneroView(controller)
}

main()
