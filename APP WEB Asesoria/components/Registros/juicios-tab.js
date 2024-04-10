//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'



const template = document.createElement('template')

const html = await (
  await fetch('./components/Registros/juicios-tab.html')
).text()
template.innerHTML = html


class JuiciosTab extends HTMLElement {
  #tipoJuicio
  #estatusJuicio
  #juicios
  #api
  #idSeleccion


  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))

    this.init();
  }

  async init() {
    this.#api = new APIModel();
    this.#idSeleccion = null;

    this.manageFormFields();
    this.fillInputs();

  }
  
  manageFormFields() {
    this.#tipoJuicio = this.shadowRoot.getElementById('tipo-juicio');
    this.#estatusJuicio = this.shadowRoot.getElementById('estatus-tipo-juicio');
    this.#juicios = this.shadowRoot.getElementById('table-tipo-juicio');

    var tipoJuicioInput = this.#tipoJuicio;

    tipoJuicioInput.addEventListener('input', function () {
      if (tipoJuicioInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de tipo de juicio es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true

      }
      else if (tipoJuicioInput.value.length > 100) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de tipo de juicio no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });


  }

  fillInputs() {
    this.agregarEventosBotones();
    this.mostrarTiposDeJuicio();
  }

  agregarEventosBotones = () => {
    const agregarTipoJuicioBtn = this.shadowRoot.getElementById('agregar-tipo-juicio');

    agregarTipoJuicioBtn.addEventListener('click', this.agregarTipoJuicio);

    const editarTipoJuicioBtn = this.shadowRoot.getElementById('editar-tipo-juicio');
    editarTipoJuicioBtn.addEventListener('click', this.editarTipoJuicio);

    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-tipo-juicio');
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const tipoJuicioId = boton.dataset.id;
        console.log(tipoJuicioId);
        this.#idSeleccion = tipoJuicioId;
        this.activarBotonSeleccionar(tipoJuicioId);
      });
    });

    const llamarActivarBotonSeleccionar = (tipoJuicioId) => {
      this.activarBotonSeleccionar(tipoJuicioId);
    };

    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
  }

  agregarTipoJuicio = async () => {
    const tipoJuicioID = this.#idSeleccion;

    if (tipoJuicioID === null) {




      const tipoJuicioInput = this.#tipoJuicio.value;
      const estatusJuicioInput = this.#estatusJuicio.value;

      try {
        if (tipoJuicioInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de tipo de juicio es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusJuicioInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de juicio es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (tipoJuicioInput !== '' && estatusJuicioInput !== '0') {
          if (tipoJuicioInput.length > 100) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de tipo de juicio no puede contener más de 100 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {

            const nuevoTipoJuicio = {
              tipo_juicio: tipoJuicioInput,
              estatus_general: estatusJuicioInput.toUpperCase()
            };

            const response = await this.#api.postTiposJuicio(nuevoTipoJuicio);

            if (response) {
              this.#tipoJuicio.value = '';
              this.#estatusJuicio.value = '0';
              this.IdSeleccion = null;
              this.mostrarTiposDeJuicio();
            }
          }
        }




      } catch (error) {
        console.error('Error al agregar un nuevo tipo de juicio:', error);
      }
    } else {
      const modal = document.querySelector('modal-warning')
      modal.message = 'No se puede agregar un nuevo tipo de juicio si ya se ha seleccionado uno, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#tipoJuicio.value = '';
      this.#estatusJuicio.value = '0';
      this.#idSeleccion = null;
      this.mostrarTiposDeJuicio();


    }


  }

  editarTipoJuicio = async () => {
    const tipoJuicioID = this.#idSeleccion; 
    if (this.#idSeleccion === null) {
      const modal = document.querySelector('modal-warning')
      modal.message = 'Debe seleccionar un tipo de juicio para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {

      const tipoJuicioInput = this.#tipoJuicio.value;
      const estatusJuicioInput = this.#estatusJuicio.value;

      try {
        if (tipoJuicioInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de tipo de juicio es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusJuicioInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de juicio es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }


        if (tipoJuicioInput !== '' && estatusJuicioInput !== '0') {
          if (tipoJuicioInput.length > 100) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de tipo de juicio no puede contener más de 100 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {
            const tipoDeJuicio = {
              id_tipo_juicio: tipoJuicioID,
              tipo_juicio: tipoJuicioInput,
              estatus_general: estatusJuicioInput.toUpperCase()
            };


            const tipoJuicioObtenido = await this.#api.getTiposJuicioByID(tipoJuicioID);

            if (tipoJuicioObtenido.tipoDeJuicio.tipo_juicio === tipoDeJuicio.tipo_juicio && tipoJuicioObtenido.tipoDeJuicio.estatus_general === tipoDeJuicio.estatus_general) {

              const modal = document.querySelector('modal-warning')
              modal.message = 'No se han realizado cambios en el tipo de juicio, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#tipoJuicio.value = '';
              this.#estatusJuicio.value = '0';
              this.#idSeleccion = null;

            } else {

              const response = await this.#api.putTiposJuicio(tipoJuicioID, tipoDeJuicio);

              if (response) {
                this.#tipoJuicio.value = '';
                this.#estatusJuicio.value = '0';
                this.#idSeleccion = null;
                this.mostrarTiposDeJuicio();
              }

            }
          }
        }





      } catch (error) {
        console.error('Error al editar el tipo de juicio:', error);
      }
    }
  }

  mostrarTiposDeJuicio = async () => {
    try {

      const tiposJuicio = await this.#api.getTiposJuicio();
      const tableBody = this.#juicios;
      tableBody.innerHTML = '';
      const lista = tiposJuicio.tiposDeJuicio;
      const funcion =
        lista.forEach(tipo => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <tr id="tipo-juicio-${tipo.id_tipo_juicio}">
            <td class="px-6 py-4 whitespace-nowrap">${tipo.id_tipo_juicio}</td>
            <td class="px-6 py-4 whitespace-nowrap">${tipo.tipo_juicio}</td>
            <td class="px-6 py-4 whitespace-nowrap">${tipo.estatus_general}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-tipo-juicio" onclick="llamarActivarBotonSeleccionar(this.value)" value="${tipo.id_tipo_juicio}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `;
          tableBody.appendChild(row);
        });
    } catch (error) {
      console.error('Error al obtener los tipos de juicio:', error);
    }
  }

  activarBotonSeleccionar = async tipoJuicioId => {
    try {

      const tipoJuicioID = await this.#api.getTiposJuicioByID(tipoJuicioId);
      if (tipoJuicioID) {
        this.#idSeleccion = tipoJuicioID.tipoDeJuicio.id_tipo_juicio;
        this.#tipoJuicio.value = tipoJuicioID.tipoDeJuicio.tipo_juicio;
        this.#estatusJuicio.value = tipoJuicioID.tipoDeJuicio.estatus_general;
      } else {
        console.error('El tipo de juicio con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener el tipo de juicio por ID:', error);
    }
  }


}

customElements.define('juicio-tab', JuiciosTab);
