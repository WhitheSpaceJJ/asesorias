import {  MotivoController } from '../controllers/motivo.controller'
import { APIModel } from '../models/api.model'
import { MotivoView } from '../views/motivo.view'

const main = () => {
  const model = new APIModel()
  const controller = new MotivoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new MotivoView(controller)
}

main()
