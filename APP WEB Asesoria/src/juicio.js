import {  JuicioController } from '../controllers/juicio.controller'
import { APIModel } from '../models/api.model'
import { JuicioView } from '../views/juicio.view'

const main = () => {
  const model = new APIModel()
  const controller = new JuicioController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new JuicioView(controller)
}

main()
