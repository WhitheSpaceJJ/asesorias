import { ValidationError } from '../../lib/errors'
import { getDate, validateNonEmptyFields } from '../../lib/utils'
import { APIModel } from '../../models/api.model'

const template = document.createElement('template')

const html = await (
  await fetch('./components/asesoria/asesoria-tab.html')
).text()
template.innerHTML = html

export class AsesoriaTab extends HTMLElement {
  #api
  #asesores
  #defensores
  #tiposJuicio

  #asesor
  #defensor
  #tipoJuicio
  #resumen
  #conclusion
  #recibido
  #recibidoValue
  #requisitos
  #requisitosValue
  #tipoEmpleado
  #tipoEmpleadoValue

  #distritos
  #distrito



  #municipio

  static get observedAttributes() {
    return ['id', 'data']
  }

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))

    this.id = 'asesoria'
    this.style.display = 'none'

    this.init()
  }

  async init() {
    this.#api = new APIModel()

    const { asesores } = await this.#api.getAsesores2()
    this.#asesores = asesores

    const { defensores } = await this.#api.getDefensores2()
    this.#defensores = defensores

    const { tiposDeJuicio } = await this.#api.getTiposJuicio2()
    this.#tiposJuicio = tiposDeJuicio



    this.#distritos = await this.#api.getDistritos()


    this.manageFormFields()
    this.fillInputs()

    var resumenInput = this.#resumen;

    resumenInput.addEventListener('input', function () {
      if (resumenInput.value === '') {

        const modal = document.querySelector('modal-warning')
        modal.message = 'El resumen no puede estar vacío, por favor ingreselo.'
        modal.title = 'Error de validación'
        modal.open = true

      } else if (resumenInput.value.length > 250) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El resumen no puede tener más de 250 caracteres, por favor revisa.'
        modal.title = 'Error de validación'
        modal.open = true
      }

    });

    var conclusionInput = this.#conclusion;

    conclusionInput.addEventListener('input', function () {

      if (conclusionInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'La conclusión no puede estar vacía, por favor ingresela.'
        modal.title = 'Error de validación'
        modal.open = true
      } else if (conclusionInput.value.length > 250) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'La conclusión no puede tener más de 250 caracteres, por favor revisa.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });


  }

  manageFormFields() {
    this.#asesor = this.shadowRoot.getElementById('asesor')
    this.#defensor = this.shadowRoot.getElementById('defensor')
    this.#tipoJuicio = this.shadowRoot.getElementById('tipo-juicio')
    this.#municipio = this.shadowRoot.getElementById('municipio')
    this.#distrito = this.shadowRoot.getElementById('distrito')
    this.#distrito.addEventListener('change', this.agregarMunicipiosByDistrito)


    this.#resumen = this.shadowRoot.getElementById('resumen')
    this.#conclusion = this.shadowRoot.getElementById('conclusion')



    this.#recibido = this.shadowRoot.querySelectorAll(
      '#recibido input[type="checkbox"]'
    )


    this.#requisitos = this.shadowRoot.querySelectorAll(
      'input[type="radio"][name="rb-requisitos"]'
    )
    this.#tipoEmpleado = this.shadowRoot.querySelectorAll(
      'input[type="radio"][name="rb-empleado"]'
    )
  }
  agregarMunicipiosByDistrito = async () => {
    if (this.#distrito.value === '0') {
      this.shadowRoot.getElementById('municipio').value = '0'
      this.shadowRoot.getElementById('municipio').disabled = true
    } else if (this.#distrito.value !== '0') {
      const id_distrito = this.#distrito.value
      const municipios = await this.#api.getMunicipiosByDistrito(id_distrito)


      this.shadowRoot.getElementById('municipio').value = '0'
      this.shadowRoot.getElementById('municipio').disabled = false


      municipios.forEach(municipio => {
        const option = document.createElement('option')
        option.value = municipio.id_municipio_distrito
        option.text = municipio.nombre_municipio
        this.#municipio.appendChild(option)
      })
    }
  }

  fillInputs() {
    this.#asesores.forEach(asesor => {
      const option = document.createElement('option')
      option.value = asesor.id_asesor
      option.textContent = asesor.nombre_asesor
      this.#asesor.appendChild(option)
    })

    this.#defensores.forEach(defensor => {
      const option = document.createElement('option')
      option.value = defensor.id_defensor
      option.textContent = defensor.nombre_defensor
      this.#defensor.appendChild(option)
    })

    this.#tiposJuicio.forEach(tipoJuicio => {
      const option = document.createElement('option')
      option.value = tipoJuicio.id_tipo_juicio
      option.textContent = tipoJuicio.tipo_juicio
      this.#tipoJuicio.appendChild(option)
    })

    this.#distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distrito.appendChild(option)
    })


  }

  getValues() {
    const checkboxesMarcados = Array.from(this.#recibido).filter(
      checkbox => checkbox.checked
    )
    this.#recibidoValue = checkboxesMarcados.map(checkbox => {
      return {
        id_catalogo: Number(checkbox.value),
        descripcion_catalogo: checkbox.dataset.name,
      }
    })

    const radioSeleccionado = Array.from(this.#requisitos).find(
      radio => radio.checked
    )
    this.#requisitosValue = radioSeleccionado
      ? radioSeleccionado.value
      : undefined

    this.#tipoEmpleadoValue = Array.from(this.#tipoEmpleado).find(
      radio => radio.checked
    )?.value
  }

  validateInputs() {
    this.getValues()

    const inputs = [
      this.#tipoJuicio.value,
      this.#resumen.value,
      this.#conclusion.value,
      this.#recibidoValue.length,
      this.#requisitosValue,
    ]

    try {

      if (
        (this.#tipoEmpleadoValue === 'asesor' && !this.#asesor.value) ||
        (this.#tipoEmpleadoValue === 'defensor' && !this.#defensor.value)
      ) {
        throw new ValidationError(
          'Es necesario seleccionar un asesor o defensor, por favor revise.'
        )
      }

      if (this.#tipoJuicio.value === '') {
        throw new ValidationError('Selecciona un tipo de juicio, por favor.')
      }

      if (this.#municipio.value === '' || this.#distrito.value === '') {
        throw new ValidationError('Selecciona un distrito y un municipio, por favor.')
      }



      if (this.#resumen.value === '') {
        throw new ValidationError('El resumen no puede estar vacío, por favor ingreselo.')
      } else if (this.#resumen.value.length > 250) {
        throw new ValidationError('El resumen no puede tener más de 250 caracteres, por favor revisa.')
      }

      if (this.#conclusion.value === '') {
        throw new ValidationError('La conclusión no puede estar vacía, por favor ingresela.')
      } else if (this.#conclusion.value.length > 250) {
        throw new ValidationError('La conclusión no puede tener más de 250 caracteres, por favor revisa.')
      }

      if (this.#recibidoValue.length === 0) {
        throw new ValidationError('Selecciona al menos un documento recibido, por favor.')
      }

      if (!this.#requisitosValue) {
        throw new ValidationError('Selecciona si cumple con los requisitos, por favor.')
      }

      /*
            if (!validateNonEmptyFields(inputs)) {
              throw new ValidationError(
                'Campos obligatorios en blanco, por favor revise.'
              )
            }
      
            */


      return true
    } catch (error) {
      if (error instanceof ValidationError) {
        this.#showModal(error.message, 'Error de validación')
      } else {
        console.error(error)
        this.#showModal(
          'Error al registrar el turno, por favor intenta de nuevo',
          'Error'
        )
      }

      return false
    }
  }

  connectedCallback() {
    this.btnNext = this.shadowRoot.getElementById('btn-asesoria-next')

    // Mueve la creación de elementos del sombreado aquí
    const recibidoDiv = this.shadowRoot.getElementById('recibido');
    this.#api.getCatalogos2().then(({ requisitosCatalogo }) => {
      requisitosCatalogo.forEach(requisito => {
        const checkboxDiv = document.createElement('div');
        checkboxDiv.classList.add('flex', 'items-center');

        const input = document.createElement('input');
        input.id = `cbx-${requisito.descripcion_catalogo.toLowerCase().replace(' ', '-')}`;
        input.type = 'checkbox';
        input.value = requisito.id_catalogo;
        input.name = 'recibido';
        input.dataset.name = requisito.descripcion_catalogo;
        input.classList.add('w-4', 'h-4', 'text-blue-600', 'bg-gray-100', 'border-gray-300', 'rounded', 'focus:ring-blue-500', 'focus:ring-2');

        const label = document.createElement('label');
        label.htmlFor = input.id;
        label.classList.add('text-sm', 'text-black', 'ms-2');
        label.textContent = requisito.descripcion_catalogo;

        checkboxDiv.appendChild(input);
        checkboxDiv.appendChild(label);
        recibidoDiv.appendChild(checkboxDiv);
      });
    });

    const radioButtons = this.shadowRoot.querySelectorAll(
      'input[name="rb-empleado"]'
    )
    const asesorContainer = this.shadowRoot.getElementById('select-asesor')
    const defensorContainer = this.shadowRoot.getElementById('select-defensor')

    radioButtons.forEach(radioButton => {
      radioButton.addEventListener('change', event => {
        if (event.target.value === 'asesor') {
          asesorContainer.classList.remove('hidden')
          asesorContainer.classList.add('flex')
          defensorContainer.classList.add('hidden')
        } else {
          asesorContainer.classList.add('hidden')
          asesorContainer.classList.remove('flex')
          defensorContainer.classList.remove('hidden')
          defensorContainer.classList.add('flex')
        }
      })
    })

    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'detalles' },
      })
      this.dispatchEvent(event)
    })

    document.addEventListener('tab-change', event => { })
  }

  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }

  get isComplete() {
    return this.validateInputs()
  }

  get data() {
    this.getValues()

    const datos_asesoria = {
      resumen_asesoria: this.#resumen.value,
      conclusion_asesoria: this.#conclusion.value,
      estatus_requisitos: this.#requisitosValue === 'yes',
      fecha_registro: getDate(),
      usuario: this.#api.user.name,
      id_usuario: this.#api.user.id_usuario,
      estatus_asesoria: 'NO_TURNADA',
      id_distrito_judicial: Number(this.#distrito.value),
      id_municipio_distrito: Number(this.#municipio.value)
    }
    const recibidos = this.#recibidoValue.map(
      ({ id_catalogo, descripcion_catalogo }) => {
        return {
          id_catalogo: Number(id_catalogo),
          descripcion_catalogo,
        }
      }
    )
    const tipos_juicio = {
      id_tipo_juicio: Number(this.#tipoJuicio.value),
      tipo_juicio:
        this.#tipoJuicio.options[this.#tipoJuicio.selectedIndex].text,
    }
    const idEmpleado =
      this.#tipoEmpleadoValue === 'asesor'
        ? this.#asesor.value
        : this.#defensor.value
    const nombreEmpleado =
      this.#tipoEmpleadoValue === 'asesor'
        ? this.#asesor.options[this.#asesor.selectedIndex].text
        : this.#defensor.options[this.#defensor.selectedIndex].text
    const empleado =
      this.#tipoEmpleadoValue === 'asesor'
        ?
        {
          id_empleado: Number(idEmpleado),
          nombre_asesor: nombreEmpleado,
        } : {
          id_empleado: Number(idEmpleado),
          nombre_defensor: nombreEmpleado,
        }

    return {
      datos_asesoria,
      recibidos,
      tipos_juicio,
      empleado,
    }
  }

  set data(value) {
    this.setAttribute('data', value)
  }

  get id() {
    return this.getAttribute('id')
  }

  set id(value) {
    this.setAttribute('id', value)
  }
}

customElements.define('asesoria-tab', AsesoriaTab)
