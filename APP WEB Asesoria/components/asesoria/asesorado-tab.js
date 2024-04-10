import { ValidationError } from '../../lib/errors.js'
import { validateNonEmptyFields } from '../../lib/utils.js'
import { APIModel } from '../../models/api.model'
import '../codigo-postal/codigo-postal.js'

const template = document.createElement('template')

const html = await (
  await fetch('./components/asesoria/asesorado-tab.html')
).text()
template.innerHTML = html

export class AsesoradoTab extends HTMLElement {
  #api
  #generos
  #motivos
  #estadosCiviles

  #nombre
  #apellidoPaterno
  #apellidoMaterno
  #edad
  #sexo
  #telefono
  #estatusTrabajo
  #ingreso
  #motivo
  #estadoCivil
  #numeroHijos
  #domicilio

  static get observedAttributes() {
    return ['id', 'data']
  }

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))
    this.id = 'asesorado'

    this.init()
  }
  
  async init() {
    this.#api = new APIModel()

    const { generos } = await this.#api.getGeneros2()
    this.#generos = generos

    const { motivos } = await this.#api.getMotivos2()
    this.#motivos = motivos

    const { estadosCiviles } = await this.#api.getEstadosCiviles2()
    this.#estadosCiviles = estadosCiviles

    this.manageFormFields()
    this.fillInputs()
    // Obtener una referencia al campo de entrada
    var nombreInput = this.#nombre;
    var apellidoPaternoInput = this.#apellidoPaterno;
    var apellidoMaternoInput = this.#apellidoMaterno;
    // Agregar un evento 'input' al campo de entrada para validar en tiempo real
    nombreInput.addEventListener('input', function () {
      var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

      if (nombreInput.value === '') {
        // Si el campo está vacío, lanzar una excepción
        const modal = document.querySelector('modal-warning')
        modal.message = 'El nombre no puede estar vacío, por favor ingréselo.'
        modal.title = 'Error de validación'
        modal.open = true
      } else
        if (!nombrePattern.test(nombreInput.value)) {
          // Si el campo contiene caracteres no válidos, lanzar una excepción

          const modal = document.querySelector('modal-warning')
          modal.message = 'El nombre solo permite letras, verifique su respuesta.'
          modal.title = 'Error de validación'
          modal.open = true

        } else if (nombreInput.value.length > 50) {
          // Si el campo tiene más de 50 caracteres, lanzar una excepción
          const modal = document.querySelector('modal-warning')
          modal.message = 'El nombre no puede tener más de 50 caracteres, por favor ingréselo correctamente.'
          modal.title = 'Error de validación'
          modal.open = true
        }
    });

    apellidoPaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

      if (apellidoPaternoInput.value === '') {
        const modal = document.querySelector('modal-warning');
        modal.message = 'El apellido paterno no puede estar vacío, por favor ingréselo.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (!apellidoPattern.test(apellidoPaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.message = 'El apellido paterno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoPaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.message = 'El apellido paterno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

    apellidoMaternoInput.addEventListener('input', function () {
      var apellidoPattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

      if (apellidoMaternoInput.value === '') {
        const modal = document.querySelector('modal-warning');
        modal.message = 'El apellido materno no puede estar vacío, por favor ingréselo.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (!apellidoPattern.test(apellidoMaternoInput.value)) {
        const modal = document.querySelector('modal-warning');
        modal.message = 'El apellido materno solo permite letras, verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      } else if (apellidoMaternoInput.value.length > 50) {
        const modal = document.querySelector('modal-warning');
        modal.message = 'El apellido materno no puede tener más de 50 caracteres, por favor ingréselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

    var edadInput = this.#edad;

    edadInput.addEventListener('input', function () {
      var edadPattern = /^\d+$/;
      if (!edadPattern.test(edadInput.value)) {
        if (edadInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.message = 'La edad no puede estar vacía, por favor ingresela.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else {
          const modal = document.querySelector('modal-warning');
          modal.message = 'La edad solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      } else if (edadInput.value > 200) {
        const modal = document.querySelector('modal-warning');
        modal.message = 'La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.';
        modal.title = 'Error de validación';
        modal.open = true;
      }
    });

    var numeroHijosInput = this.#numeroHijos;

    numeroHijosInput.addEventListener('input', function () {
      var enterosPattern = /^\d+$/;
      if (!enterosPattern.test(numeroHijosInput.value)) {
        if (numeroHijosInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.message = 'El número de hijos no puede estar vacío, por favor ingreselo.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else {
          const modal = document.querySelector('modal-warning');
          modal.message = 'El número de hijos solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      }
      else if (numeroHijosInput.value > 200) {
        const modal = document.querySelector('modal-warning');
        modal.message = 'El número de hijos no puede ser mayor a 200, por favor ingreselo correctamente.';
        modal.title = 'Error de validación';
        modal.open = true;
      }

    });

    var telefonoInput = this.#telefono;

    telefonoInput.addEventListener('input', function () {
      var enterosPattern = /^\d+$/;

      if (telefonoInput.value !== '') {
        if (!enterosPattern.test(telefonoInput.value)) {
          const modal = document.querySelector('modal-warning');
          modal.message = 'El teléfono solo debe de tener dígitos, nada de espacios en blanco, por favor ingreselo correctamente.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
        else
          if (telefonoInput.value.length > 10) {
            const modal = document.querySelector('modal-warning');
            modal.message = 'El teléfono no debe tener 10 dígitos, por favor ingreselo correctamente.';
            modal.title = 'Error de validación';
            modal.open = true;
          }
        /*else if (telefonoInput.value.length < 10) {
          const modal = document.querySelector('modal-warning');
          modal.message ='El teléfono no debe ser menor a 10 dígitos, por favor ingreselo correctamente.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
        */
      }

    });

    /*
    
    
      var numeroExteriorInput = this.#domicilio.data.numeroExt;
      var numeroInteriorInput =this.#domicilio.data.numeroInt;
    
      var nombrePattern = /^[A-Za-z]+$/;
    
      numeroExteriorInput.addEventListener('input', function () {
        if (numeroExteriorInput === '') {
          const modal = document.querySelector('modal-warning');
          modal.message = 'El número exterior no puede estar vacío, por favor ingreselo.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else if (nombrePattern.test(numeroExteriorInput)) {
          const modal = document.querySelector('modal-warning');
          modal.message = 'El número exterior solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else if (numeroExteriorInput.length > 10) {
          const modal = document.querySelector('modal-warning');
          modal.message = 'El número exterior no debe tener más de 10 dígitos, por favor ingreselo correctamente.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      });
      numeroInteriorInput.addEventListener('input', function () {
      
        if (numeroInteriorInput !== '') {
          if (nombrePattern.test(numeroInteriorInput)) {
            const modal = document.querySelector('modal-warning');
            modal.message = 'El número interior solo permite números, verifique su respuesta.';
            modal.title = 'Error de validación';
            modal.open = true;
          } else
            if (numeroInteriorInput.length > 10) {
              const modal = document.querySelector('modal-warning');
              modal.message = 'El número interior no puede tener más de 10 caracteres, por favor ingreselo correctamente.';
              modal.title = 'Error de validación';
              modal.open = true;
            }
        }
      });
     
    
     */

  }

  manageFormFields() {
    this.#nombre = this.shadowRoot.getElementById('nombre')
    this.#apellidoPaterno = this.shadowRoot.getElementById('apellido-paterno')
    this.#apellidoMaterno = this.shadowRoot.getElementById('apellido-materno')
    this.#edad = this.shadowRoot.getElementById('edad')
    this.#sexo = this.shadowRoot.getElementById('sexo')
    this.#telefono = this.shadowRoot.getElementById('telefono')
    this.#motivo = this.shadowRoot.getElementById('motivo')
    this.#estadoCivil = this.shadowRoot.getElementById('estado-civil')
    this.#numeroHijos = this.shadowRoot.getElementById('numero-hijos')
    this.#domicilio = this.shadowRoot.querySelector('cp-comp')


  }

  fillInputs() {
    this.#generos.forEach(genero => {
      const option = document.createElement('option')
      option.value = genero.id_genero
      option.text = genero.descripcion_genero
      this.#sexo.appendChild(option)
    })

    this.#motivos.forEach(motivo => {
      const option = document.createElement('option')
      option.value = motivo.id_motivo
      option.text = motivo.descripcion_motivo
      this.#motivo.appendChild(option)
    })

    this.#estadosCiviles.forEach(estadoCivil => {
      const option = document.createElement('option')
      option.value = estadoCivil.id_estado_civil
      option.text = estadoCivil.estado_civil
      this.#estadoCivil.appendChild(option)
    })
  }

  validateInputs() {
    this.#estatusTrabajo = this.shadowRoot.querySelector(
      'input[name="rb-trabajo"]:checked'
    )?.value
    this.#ingreso = this.shadowRoot.querySelector(
      'input[name="rb-ingreso"]:checked'
    )?.value
    const inputs = [
      this.#nombre.value,
      this.#apellidoPaterno.value,
      this.#apellidoMaterno.value,
      this.#edad.value,
      this.#sexo.value,
      this.#telefono.value,
      this.#estatusTrabajo,
      this.#estadoCivil.value,
      this.#numeroHijos.value,
      this.#domicilio.data.calle,
      this.#domicilio.data.numeroExt,
      this.#domicilio.data.colonia,
    ]
    try {
    //  var nombrePattern2 = /^[A-Za-z\s]+$/; // Se añade \s para permitir espacios en blanco
      var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
   //   var nombrePattern = /^[A-Za-z]+$/;
      var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

      var enterosPattern = /^\d+$/;

      if (this.#nombre.value === '') {
        throw new ValidationError('El nombre no puede estar vacío, por favor ingreselo.')
      }
      else if (!nombrePattern2.test(this.#nombre.value)) {
        throw new ValidationError('El nombre solo permite letras, verifique su respuesta.')
      } else if (this.#nombre.value.length > 50) {
        throw new ValidationError('El nombre no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
      }



      if (this.#apellidoPaterno.value === '') {
        throw new ValidationError('El apellido paterno no puede estar vacío, por favor ingreselo.')
      }
      else if (!nombrePattern2.test(this.#apellidoPaterno.value)) {
        throw new ValidationError('El apellido paterno solo permite letras, verifique su respuesta.')
      } else if (this.#apellidoPaterno.value.length > 50) {
        throw new ValidationError('El apellido paterno no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
      }

      if (this.#apellidoMaterno.value === '') {
        throw new ValidationError('El apellido materno no puede estar vacío, por favor ingreselo.')
      }
      else if (!nombrePattern2.test(this.#apellidoMaterno.value)) {
        throw new ValidationError('El apellido materno solo permite letras, verifique su respuesta.')
      } else if (this.#apellidoMaterno.value.length > 50) {
        throw new ValidationError('El apellido materno no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
      }



      if (!enterosPattern.test(this.#edad.value)) {
        if (this.#edad.value === '') {
          throw new ValidationError('La edad no puede estar vacía, por favor ingresela.')
        } else {
          throw new ValidationError('La edad solo permite números, verifique su respuesta.')
        }
      }
      else if (this.#edad.value > 200) {
        throw new ValidationError('La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.')
      }


      if (this.#sexo.value === '') {
        throw new ValidationError('El sexo es obligatorio, por favor seleccione uno.')
      }
      /*
      if(this.#telefono.value ===''){
        throw new ValidationError('El teléfono no puede estar vacío, por favor ingreselo.')
      }
      else 
      */
      if (this.#telefono.value !== '') {
        if (!enterosPattern.test(this.#telefono.value)) {
          throw new ValidationError('El teléfono solo debe de  dígitos, por favor ingreselo correctamente.')
        }
        else if (this.#telefono.value.length > 10) {
          throw new ValidationError('El teléfono no debe tener 10 dígitos, por favor ingreselo correctamente.')
        } else if (this.#telefono.value.length < 10) {
          throw new ValidationError('El teléfono no debe ser menor a 10 dígitos, por favor ingreselo correctamente.')
        }
      }


      if (this.#estatusTrabajo === '' || this.#estatusTrabajo === undefined) {
        throw new ValidationError('Seleccione una opción para el ingreso o el motivo de no trabajar.')
      } else if (this.#estatusTrabajo === 'yes' && this.#ingreso === undefined) {
        throw new ValidationError('Seleccione una opción para el ingreso promedio.')
      } else if (this.#estatusTrabajo === 'no' && this.#motivo.value === '') {
        throw new ValidationError('Seleccione una opción para el motivo de no trabajar.')
      }
      /*
            if (
              (this.#estatusTrabajo === 'yes' && !this.#ingreso) ||
              (this.#estatusTrabajo === 'no' && !this.#motivo)
            ) {
              throw new ValidationError(
                'Seleccione una opción para el ingreso o el motivo de no trabajar.'
              )
            }
      */
      if (this.#estadoCivil.value === '') {
        throw new ValidationError('El estado civil es obligatorio, por favor seleccione uno.')
      }

      if (!enterosPattern.test(this.#numeroHijos.value)) {
        if (this.#numeroHijos.value === '') {
          throw new ValidationError('El número de hijos no puede estar vacío, por favor ingreselo.')
        } else {
          throw new ValidationError('El número de hijos solo permite números, verifique su respuesta.')
        }
      }
      else if (this.#numeroHijos.value > 200) {
        throw new ValidationError('El número de hijos no puede ser mayor a 200, por favor ingreselo correctamente.')
      }


      if (this.#domicilio.data.calle === '') {
        throw new ValidationError('La calle no puede estar vacía, por favor ingresela.')
      } else if (this.#domicilio.data.calle.length > 75) {
        throw new ValidationError('La calle no puede tener más de 75 caracteres, por favor ingresela correctamente.')
      }

      if (this.#domicilio.data.numeroExt === '') {
        throw new ValidationError('El número exterior no puede estar vacío, por favor ingreselo.')
      } else if (!enterosPattern.test(this.#domicilio.data.numeroExt)) {
        throw new ValidationError('El número exterior solo permite números, verifique su respuesta.')
      } else if (this.#domicilio.data.numeroExt.length > 10) {
        throw new ValidationError('El número exterior no debe tener más de 10 dígitos, por favor ingreselo correctamente.')
      }
      if (this.#domicilio.data.numeroInt !== '') {
        if (!enterosPattern.test(this.#domicilio.data.numeroInt)) {
          throw new ValidationError('El número interior solo permite números, verifique su respuesta.')
        } else
          if (this.#domicilio.data.numeroInt.length > 10) {
            throw new ValidationError('El número interior no puede tener más de 10 caracteres, por favor ingreselo correctamente.')
          }
      }

      if (this.#domicilio.data.colonia === '') {
        throw new ValidationError('La colonia es obligatoria, por favor busque una con el codigo postal.')
      }

      /*
           if (!validateNonEmptyFields(inputs)) {
             throw new ValidationError(
               'Campos obligatorios en blanco, por favor revise.'
             )
           }
           if (
             (this.#estatusTrabajo === 'yes' && !this.#ingreso) ||
             (this.#estatusTrabajo === 'no' && !this.#motivo)
           ) {
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
    this.btnNext = this.shadowRoot.getElementById('btn-asesorado-next')
    const radioButtons = this.shadowRoot.querySelectorAll(
      'input[name="rb-trabajo"]'
    )
    const ingresoContainer = this.shadowRoot.getElementById('ingreso-container')
    const motivoContainer = this.shadowRoot.getElementById('motivo-container')

    radioButtons.forEach(radioButton => {
      radioButton.addEventListener('change', event => {
        if (event.target.value === 'yes') {
          ingresoContainer.classList.remove('hidden')
          ingresoContainer.classList.add('flex')
          motivoContainer.classList.add('hidden')
        } else {
          ingresoContainer.classList.add('hidden')
          ingresoContainer.classList.remove('flex')
          motivoContainer.classList.remove('hidden')
          motivoContainer.classList.add('flex')
        }
      })
    })


    this.btnNext.addEventListener('click', () => {
      if (!this.validateInputs()) return
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'asesoria' },
      })
      this.dispatchEvent(event)
    })
  }

  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }

  get id() {
    return this.getAttribute('id')
  }

  set id(value) {
    this.setAttribute('id', value)
  }

  get isComplete() {
    return this.validateInputs()
  }

  get data() {
    const asesorado = {
      estatus_trabajo: this.#estatusTrabajo === 'yes',
      numero_hijos: Number(this.#numeroHijos.value),
      ingreso_mensual: Number(this.#ingreso) || null,
      motivo: {
        id_motivo: Number(this.#motivo.value),
      },
      estado_civil: {
        id_estado_civil: Number(this.#estadoCivil.value),
        estado_civil:
          this.#estadoCivil.options[this.#estadoCivil.selectedIndex].text,
      },
    }
    const persona = {
      nombre: this.#nombre.value,
      apellido_paterno: this.#apellidoPaterno.value,
      apellido_materno: this.#apellidoMaterno.value,
      edad: Number(this.#edad.value),
      telefono: this.#telefono.value,
      domicilio: {
        calle_domicilio: this.#domicilio.data.calle,
        numero_exterior_domicilio: this.#domicilio.data.numeroExt,
        numero_interior_domicilio: this.#domicilio.data.numeroInt,
        id_colonia: this.#domicilio.data.colonia,
      },
      genero: {
        id_genero: Number(this.#sexo.value),
        descripcion_genero: this.#sexo.options[this.#sexo.selectedIndex].text,
      },
    }

    return {
      asesorado,
      persona,
    }
  }

  set data(value) {
    this.setAttribute('data', value)
  }
}

customElements.define('asesorado-full-tab', AsesoradoTab)
