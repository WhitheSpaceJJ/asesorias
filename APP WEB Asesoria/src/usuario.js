import {  UsuarioController } from '../controllers/usuario.controller'
import { APIModel } from '../models/api.model'
import { UsuarioView } from '../views/usuario.view'

const main = () => {
  const model = new APIModel()
  const controller = new UsuarioController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new UsuarioView(controller)
}

main()
