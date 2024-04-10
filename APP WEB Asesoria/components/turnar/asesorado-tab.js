import { APIModel } from '../../models/api.model'

const template = document.createElement('template')

const html = await (await fetch('../assets/turnar/asesorado-tab.html')).text()
template.innerHTML = html

export class AsesoradoTab extends HTMLElement {
  #asesoria
  #api
  #generos

  #nombre
  #apellidoPaterno
  #apellidoMaterno
  #edad
  #sexo
  #ediatableCbx


  static get observedAttributes() {
    return ['id', 'data']
  }

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))
    this.id = 'asesorado'

    this.#asesoria = JSON.parse(sessionStorage.getItem('asesoria'))

    this.#api = new APIModel()
    this.#api.getGeneros2().then(data => {
      this.#generos = data.generos

      this.manageFormFields()
      this.fillInputs()
    })
  }

  manageFormFields() {
    this.#nombre = this.shadowRoot.getElementById('nombre')
    this.#apellidoPaterno = this.shadowRoot.getElementById('apellido-paterno')
    this.#apellidoMaterno = this.shadowRoot.getElementById('apellido-materno')
    this.#edad = this.shadowRoot.getElementById('edad')
    this.#sexo = this.shadowRoot.getElementById('sexo')
    this.#ediatableCbx = this.shadowRoot.getElementById('cbx-editable-asesorado')


    var nombreInput = this.#nombre;
    var apellidoPaternoInput = this.#apellidoPaterno;
    var apellidoMaternoInput = this.#apellidoMaterno;
    var editableCbx = this.#ediatableCbx;
    // Agregar un evento 'input' al campo de entrada para validar en tiempo real

    nombreInput.addEventListener('input', function () {
      //console.log(editableCbx.value) 

      if ( editableCbx.checked) {

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

      }
    });

    apellidoPaternoInput.addEventListener('input', function () {
     
      if ( editableCbx.checked) {

     

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

    }

    });

    apellidoMaternoInput.addEventListener('input', function () {

      if ( editableCbx.checked) {



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

    }
    });

    var edadInput = this.#edad;

    edadInput.addEventListener('input', function () {
   
      if ( editableCbx.checked) {


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

    }

    });
  }

  fillInputs() {
    this.#nombre.value = this.#asesoria.persona.nombre
    this.#apellidoPaterno.value = this.#asesoria.persona.apellido_paterno
    this.#apellidoMaterno.value = this.#asesoria.persona.apellido_materno
    this.#edad.value = this.#asesoria.persona.edad

    this.#generos.forEach(genero => {
      const option = document.createElement('option')
      option.value = genero.id_genero
      option.text = genero.descripcion_genero
      this.#sexo.appendChild(option)
    })
    this.#sexo.value = this.#asesoria.persona.genero.id_genero
  }

  connectedCallback() {
    this.btnNext = this.shadowRoot.getElementById('btn-asesorado-next')
    this.editCbx = this.shadowRoot.getElementById('cbx-editable-asesorado')

    this.btnNext.addEventListener('click', () => {
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'domicilio' },
      })
      this.dispatchEvent(event)
    })

    this.editCbx.addEventListener('change', () => {
      const inputs = this.shadowRoot.querySelectorAll('input, select')
      inputs.forEach(input => {
        if (input !== this.editCbx) {
          input.disabled = !input.disabled
        }
      })
    })

    // Escucha el evento de cambio de pestaña
    document.addEventListener('tab-change', event => {
      if (event.detail.tabId === 'asesorado') {
        // clg
      }
    })
  }

  get id() {
    return this.getAttribute('id')
  }

  set id(value) {
    this.setAttribute('id', value)
  }

  get data() {
    return {
      nombre: this.#nombre.value,
      apellido_paterno: this.#apellidoPaterno.value,
      apellido_materno: this.#apellidoMaterno.value,
      edad: Number(this.#edad.value),
      genero: this.#generos.find(
        genero => genero.id_genero === Number(this.#sexo.value)
      ),
    }
  }

  set data(value) {
    this.setAttribute('data', value)
  }
}

customElements.define('asesorado-tab', AsesoradoTab)
