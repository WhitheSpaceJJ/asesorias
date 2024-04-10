import { CatalogoController   } from '../controllers/catalogo.controller'
import { APIModel } from '../models/api.model'
import { CatalogoView } from '../views/catalogo.view'

const main = () => {
  const model = new APIModel()
  const controller = new CatalogoController(model)
  // eslint-disable-next-line no-unused-vars
  const view = new CatalogoView(controller)
}

main()
