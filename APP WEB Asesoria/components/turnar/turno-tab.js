/* eslint-disable indent */
import { ValidationError } from '../../lib/errors'
import { getDate, validateNonEmptyFields } from '../../lib/utils'
import { APIModel } from '../../models/api.model'

const template = document.createElement('template')

const html = await (await fetch('../assets/turnar/turno-tab.html')).text()
template.innerHTML = html

export class TurnoTab extends HTMLElement {
  #asesoria
  #asesores
  #defensores
  #usuario
  #api

  #resumen
  #nombreAsesor
  #nombreDefensor
  #responsableTurno
  #horaTurno
  #minutoTurno
  #turnadoPorAsesor

  static get observedAttributes() {
    return ['id', 'data']
  }

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))
    this.id = 'turno'
    this.style.display = 'none'

    this.#asesoria = JSON.parse(sessionStorage.getItem('asesoria'))
    this.#usuario = JSON.parse(sessionStorage.getItem('user'))

    this.#api = new APIModel()
    this.#initialize()
  }

  async #initialize() {
    await this.#fetchEmpleados()

    this.#manageFormFields()
    this.#fillInputs()
  }

  async #fetchEmpleados() {
    try {
      const data = await this.#api.getAsesores2()
      this.#asesores = data.asesores
    } catch (error) {
      throw new Error('No se pudieron obtener los asesores')
    }

    try {
      const data = await this.#api.getDefensores2()
      this.#defensores = data.defensores
    } catch (error) {
      throw new Error('No se pudieron obtener los defensores')
    }
  }

  #manageFormFields() {
    this.#resumen = this.shadowRoot.getElementById('resumen')
    this.#nombreAsesor = this.shadowRoot.getElementById('nombre-asesor')
    this.#nombreDefensor = this.shadowRoot.getElementById('nombre-defensor')
    this.#responsableTurno = this.shadowRoot.getElementById('responsable-turno')
    this.#horaTurno = this.shadowRoot.getElementById('hora-turno')
    this.#minutoTurno = this.shadowRoot.getElementById('minuto-turno')
    this.#turnadoPorAsesor =
      this.shadowRoot.getElementById('cbx-turnado-asesor')


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

    var horaTurnoInput = this.#horaTurno;
    var minutoTurnoInput = this.#minutoTurno;


    horaTurnoInput.addEventListener('input', function () {
      if (horaTurnoInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'La hora del turno no puede estar vacía, por favor ingrésela.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {
        // Expresión regular para validar horas en formato de 12 o 24 horas
        var horaRegex = /^(0?[1-9]|1[0-2]|2[0-3])$/;
        if (!horaRegex.test(horaTurnoInput.value)) {
          const modal = document.querySelector('modal-warning')
          modal.message = 'La hora del turno no es válida, por favor ingrese un valor válido.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }

    });

    minutoTurnoInput.addEventListener('input', function () {

      // Validar los minutos del turno
      if (minutoTurnoInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message ='Los minutos del turno no pueden estar vacíos, por favor ingréselos.'
        modal.title = 'Error de validación'
        modal.open = true
      } else {
        // Expresión regular para validar minutos (0 a 59)
        var minutoRegex = /^([0-5]?[0-9])$/;
        if (!minutoRegex.test(minutoTurnoInput.value)) {
          const modal = document.querySelector('modal-warning')
          modal.message = 'Los minutos del turno no son válidos, por favor ingrese un valor válido.'
          modal.title = 'Error de validación'
          modal.open = true
        }
      }
    });


    // Validar la hora del turno




  }

  #fillInputs() {
    this.#resumen.value = this.#asesoria.datos_asesoria.resumen_asesoria

    // fill select
    this.#asesores.forEach(asesor => {
      const option = document.createElement('option')
      option.value = asesor.id_asesor
      option.textContent = `${asesor.nombre_asesor}`
      this.#nombreAsesor.appendChild(option)
    })
    this.#defensores.forEach(defensor => {
      const option = document.createElement('option')
      option.value = defensor.id_defensor
      option.textContent = `${defensor.nombre_defensor}`
      this.#nombreDefensor.appendChild(option)
    })
    /*
    if (this.#asesoria.asesor) {
      this.#nombreAsesor.value = this.#asesoria.asesor.id_asesor

      this.shadowRoot
        .getElementById('asesor-container')
        .classList.remove('hidden')
    } else {
      this.#nombreDefensor.value = this.#asesoria.defensor.id_defensor
      this.shadowRoot
        .getElementById('defensor-container')
        .classList.remove('hidden')
    }

    */
    this.#turnadoPorAsesor.checked = Boolean(this.#asesoria.turno)
    this.#responsableTurno.value = this.#usuario.name

    const [hora, minuto] = this.#asesoria?.turno?.hora_turno?.split(':') ?? []
    this.#horaTurno.value = hora ?? ''
    this.#minutoTurno.value = minuto ?? ''
  }

  connectedCallback() {
    this.btnTurnar = this.shadowRoot.getElementById('btn-registrar-turno')
    this.domicilioTab = document.querySelector('domicilio-tab')
    this.asesoradoTab = document.querySelector('asesorado-tab')

    this.btnTurnar.addEventListener('click', async () => {




      const turnoData = this.data
      const domicilioData = this.domicilioTab.data
      const asesoradoData = this.asesoradoTab.data

      // console.log(turnoData)
      //console.log(domicilioData)
      //  console.log(asesoradoData)

      /*
            const { numeroInt, ...restDomicilioData } = domicilioData
            const data = {
              ...asesoradoData,
              ...(numeroInt ? { ...domicilioData } : { ...restDomicilioData }),
              ...turnoData,
            }
            */
      // console.log(data)
      // const inputs = Object.values(data)
      // console.log(inputs.slice(0, -1))

      try {
        var nombre = asesoradoData.nombre;
        var apellidoPaterno = asesoradoData.apellido_paterno;
        var apellidoMaterno = asesoradoData.apellido_materno;
        var edad = asesoradoData.edad;
        var sexo = asesoradoData.genero;


        var nombrePattern2 = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

        var enterosPattern = /^\d+$/;

        if (nombre === '') {
          throw new ValidationError('El nombre no puede estar vacío, por favor ingreselo.')
        }
        else if (!nombrePattern2.test(nombre)) {
          throw new ValidationError('El nombre solo permite letras, verifique su respuesta.')
        } else if (nombre.length > 50) {
          throw new ValidationError('El nombre no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
        }



        if (apellidoPaterno === '') {
          throw new ValidationError('El apellido paterno no puede estar vacío, por favor ingreselo.')
        }
        else if (!nombrePattern2.test(apellidoPaterno)) {
          throw new ValidationError('El apellido paterno solo permite letras, verifique su respuesta.')
        } else if (apellidoPaterno.length > 50) {
          throw new ValidationError('El apellido paterno no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
        }

        if (apellidoMaterno === '') {
          throw new ValidationError('El apellido materno no puede estar vacío, por favor ingreselo.')
        }
        else if (!nombrePattern2.test(apellidoMaterno)) {
          throw new ValidationError('El apellido materno solo permite letras, verifique su respuesta.')
        } else if (apellidoMaterno.length > 50) {
          throw new ValidationError('El apellido materno no puede tener más de 50 caracteres, por favor ingreselo correctamente.')
        }



        if (!enterosPattern.test(edad)) {
          if (edad === 0) {
            throw new ValidationError('La edad no puede estar vacía o ser cero, por favor ingresela.')
          } else {
            throw new ValidationError('La edad solo permite números, verifique su respuesta.')
          }
        }
        else if (edad > 200) {
          throw new ValidationError('La edad no puede ser mayor a 200 años, por favor ingresela verifique su respuesta.')
        }


        var calle = domicilioData.calle;
        var ciudad = domicilioData.ciudad;
        var colonia = domicilioData.colonia;
        var cp = domicilioData.cp;
        var estado = domicilioData.estado;
        var municipio = domicilioData.municipio;
        var numeroExt = domicilioData.numeroExt;
        var numeroInt = domicilioData.numeroInt;


        if (calle === '') {
          throw new ValidationError('La calle no puede estar vacía, por favor ingresela.')
        } else if (calle.length > 75) {
          throw new ValidationError('La calle no puede tener más de 75 caracteres, por favor ingresela correctamente.')
        }


        if (numeroExt === '') {
          throw new ValidationError('El número exterior no puede estar vacío, por favor ingreselo.')
        } else if (!enterosPattern.test(numeroExt)) {
          throw new ValidationError('El número exterior solo permite números, verifique su respuesta.')
        } else if (numeroExt.length > 10) {
          throw new ValidationError('El número exterior no debe tener más de 10 dígitos, por favor ingreselo correctamente.')
        }
        if (numeroInt !== '') {
          if (!enterosPattern.test(numeroInt)) {
            throw new ValidationError('El número interior solo permite números, verifique su respuesta.')
          } else
            if (numeroInt.length > 10) {
              throw new ValidationError('El número interior no puede tener más de 10 caracteres, por favor ingreselo correctamente.')
            }
        }

        if (colonia === '') {
          throw new ValidationError('La colonia es obligatoria, por favor busque una con el codigo postal.')
        }


        if (this.#resumen.value === '') {
          throw new ValidationError('El resumen no puede estar vacío, por favor ingreselo.')
        } else if (this.#resumen.value.length > 250) {
          throw new ValidationError('El resumen no puede tener más de 250 caracteres, por favor revisa.')
        }

        
        if(this.#nombreDefensor.value === ''){
          throw new ValidationError('Debe de seleccionar un defensor, por favor seleccione uno.')
         }
 
        // Validar la hora del turno
        if (turnoData.horaTurno === '') {
          throw new ValidationError('La hora del turno no puede estar vacía, por favor ingrésela.');
        } else {
          // Expresión regular para validar horas en formato de 12 o 24 horas
          var horaRegex = /^(0?[1-9]|1[0-2]|2[0-3])$/;
          if (!horaRegex.test(turnoData.horaTurno)) {
            throw new ValidationError('La hora del turno no es válida, por favor ingrese un valor válido.');
          }
        }

        // Validar los minutos del turno
        if (turnoData.minutoTurno === '') {
          throw new ValidationError('Los minutos del turno no pueden estar vacíos, por favor ingréselos.');
        } else {
          // Expresión regular para validar minutos (0 a 59)
          var minutoRegex = /^([0-5]?[0-9])$/;
          if (!minutoRegex.test(turnoData.minutoTurno)) {
            throw new ValidationError('Los minutos del turno no son válidos, por favor ingrese un valor válido.');
          }
        }



        this.#asesoria.persona.nombre = nombre;
        this.#asesoria.persona.apellido_paterno = apellidoPaterno;
        this.#asesoria.persona.apellido_materno = apellidoMaterno;
        this.#asesoria.persona.edad = edad;
        this.#asesoria.persona.genero = sexo;



        this.#asesoria.persona.domicilio.calle_domicilio = calle;
        this.#asesoria.persona.domicilio.numero_exterior_domicilio = numeroExt;
        this.#asesoria.persona.domicilio.numero_interior_domicilio = numeroInt;
        this.#asesoria.persona.domicilio.id_colonia = colonia;

        this.#asesoria.datos_asesoria.resumen_asesoria = this.#resumen.value;
        this.#asesoria.datos_asesoria.estatus_asesoria = 'TURNADA';


        this.#asesoria.turno = {
          fecha_turno: getDate(),
          hora_turno: `${turnoData.horaTurno}:${turnoData.minutoTurno}`,
          id_defensor: this.#nombreDefensor.value,
          id_asesoria: this.#asesoria.datos_asesoria.id_asesoria,
        }
        /*


        console.log(this.#asesoria.persona)
        console.log(this.#asesoria.datos_asesoria )
        console.log(this.#asesoria.turno)



        if (!validateNonEmptyFields(inputs.slice(0, -1))) {
          throw new ValidationError(
            'Campos obligatorios en blanco, por favor revise.'
          )
        }

        */

        /*
        // replace asesorado and domicilio data
        this.#asesoria.persona = {
          ...this.#asesoria.persona,
          ...asesoradoData,
          domicilio: {
            ...this.#asesoria.persona.domicilio,
            calle_domicilio: data.calle,
            numero_exterior_domicilio: data.numeroExt,
            numero_interior_domicilio: data.numeroInt,
          },
        }
        // replace turno data
        this.#asesoria.datos_asesoria = {
          ...this.#asesoria.datos_asesoria,
          resumen_asesoria: data.resumen,
          usuario: this.#usuario.name,
        
        }
        this.#asesoria.empleado = {
          id_empleado: turnoData.empleado.id_asesor || turnoData.empleado.id_defensor,
        };

        this.#asesoria.turno = {
          fecha_turno: getDate(),
          hora_turno: `${data.horaTurno}:${data.minutoTurno}`,
        }
        delete this.#asesoria.asesor
        console.log(this.#asesoria)
        console.log(JSON.stringify(this.#asesoria))

        */
              console.log(
                await this.#api.putAsesoria({
                  id: this.#asesoria.datos_asesoria.id_asesoria,
                  data: this.#asesoria,
                })
              )
      
      
      
             this.#showModal('Turno registrado con éxito', 'Registrar turno', () => {
                location.href = '/'
              }) 

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
      }
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

  get data() {
    const idEmpelado = this.#asesoria.asesor
      ? this.#asesores.find(
        asesor => asesor.id_asesor === Number(this.#nombreAsesor.value)
      )
      : this.#defensores.find(
        defensor =>
          defensor.id_defensor === Number(this.#nombreDefensor.value)
      )
    return {
      resumen: this.#resumen.value,
      empleado: idEmpelado,
      responsableTurno: this.#usuario.name,
      horaTurno: this.#horaTurno.value,
      minutoTurno: this.#minutoTurno.value,
      turnadoPorAsesor: this.#turnadoPorAsesor.checked,
    }
  }

  set data(value) {
    this.setAttribute('data', value)
  }
}

customElements.define('turno-tab', TurnoTab)
