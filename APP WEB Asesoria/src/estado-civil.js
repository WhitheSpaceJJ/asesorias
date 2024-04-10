import {  EstadoCivilController } from '../controllers/estado-civil.controller'
import { APIModel } from '../models/api.model'
import { EstadoCivilView } from '../views/estado-civil.view'

const main = () => {
  const model = new APIModel()
  const controller = new EstadoCivilController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new EstadoCivilView(controller)
}

main()
