import { EmpleadoController } from '../controllers/empleado.controller'
import { APIModel } from '../models/api.model'
import { EmpleadoView } from '../views/empleado.view'

const main = () => {
  const model = new APIModel()
  const controller = new EmpleadoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new EmpleadoView(controller)
}

main()
