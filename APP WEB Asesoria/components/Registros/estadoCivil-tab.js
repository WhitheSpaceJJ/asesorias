//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'



const template = document.createElement('template')

const html = await (
  await fetch('./components/Registros/estadoCivil-tab.html')
).text()
template.innerHTML = html

class EstadoTab extends HTMLElement {
  #api
  #estadoCivil
  #estatusEstadoCivil
  #estadoCiviles
  #idSeleccion

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))
this.#idSeleccion = null;
    this.init();
  }

  async init() {
    this.#api = new APIModel();

    this.manageFormFields();
    this.fillInputs();

  }

  manageFormFields() {
    this.agregarEventosBotones();
    this.mostrarEstadosCiviles();
  }

  fillInputs() {
    this.#estadoCivil = this.shadowRoot.getElementById('estado-civil');
    this.#estatusEstadoCivil = this.shadowRoot.getElementById('estatus-estado-civil');
    this.#estadoCiviles = this.shadowRoot.getElementById('table-estado-civil');

    var estadoCivilInput = this.#estadoCivil;

    estadoCivilInput.addEventListener('input', function () {
      if (estadoCivilInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de estado civil es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true

      }
      else if (estadoCivilInput.value.length > 50) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de estado civil no puede contener más de 50 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });


  }

  agregarEventosBotones = () => {

    const agregarEstadoCivilBtn = this.shadowRoot.getElementById('agregar-estado-civil');
    agregarEstadoCivilBtn.addEventListener('click', this.agregarEstadoCivil);

    const editarEstadoCivilBtn = this.shadowRoot.getElementById('editar-estado-civil');
    editarEstadoCivilBtn.addEventListener('click', this.editarEstadoCivil);

    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-estado-civil');
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const estadoCivilId = boton.value;
        console.log(estadoCivilId);
        this.#idSeleccion = estadoCivilId;
        this.activarBotonSeleccionar(estadoCivilId);
      });
    });

    const llamarActivarBotonSeleccionar = (estadoCivilId) => {
      this.activarBotonSeleccionar(estadoCivilId);
    }
    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;



  }
  agregarEstadoCivil = async () => {
  
    const estadoCivilID = this.#idSeleccion;

    if (estadoCivilID === null) {

      const estadoCivilInput = this.#estadoCivil.value;
      const estatusEstadoCivilInput = this.#estatusEstadoCivil.value;

      try {
        if (estadoCivilInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estado civil es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusEstadoCivilInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de estado civil es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estadoCivilInput !== '' && estatusEstadoCivilInput !== '0') {
          if (estadoCivilInput.length > 50) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de estado civil no puede contener más de 50 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {

            const nuevoEstadoCivil = {
              estado_civil: estadoCivilInput,
              estatus_general: estatusEstadoCivilInput.toUpperCase()
            };

            const response = await this.#api.postEstadosCivil(nuevoEstadoCivil);

            if (response) {
              this.#estadoCivil.value = '';
              this.#estatusEstadoCivil.value = '0';
              this.IdSeleccion = null;
              this.mostrarEstadosCiviles();
            }
          }
        }

      } catch (error) {
        console.error('Error al agregar un nuevo estado civil:', error);
      }

    } else {
      const modal = document.querySelector('modal-warning')
      modal.message = 'No se puede agregar un nuevo estado civil si ya se ha seleccionado uno, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#estadoCivil.value = '';
      this.#estatusEstadoCivil.value = '0';
      this.#idSeleccion = null;
      this.mostrarEstadosCiviles();
    }
  }


  editarEstadoCivil = async () => {
 
    const estadoCivilID = this.#idSeleccion;
    if (estadoCivilID === null) {
      const modal = document.querySelector('modal-warning')
      modal.message = 'Debe seleccionar un estado civil para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {

      const estadoCivilInput = this.#estadoCivil.value;
      const estatusEstadoCivilInput = this.#estatusEstadoCivil.value;

      try {
        if (estadoCivilInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estado civil es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusEstadoCivilInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de estado civil es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estadoCivilInput !== '' && estatusEstadoCivilInput !== '0') {
          if (estadoCivilInput.length > 50) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de estado civil no puede contener más de 50 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {
            const estadoCivil = {
              id_estado_civil: estadoCivilID,
              estado_civil: estadoCivilInput,
              estatus_general: estatusEstadoCivilInput.toUpperCase()
            };


            const estadoCivilObtenido = await this.#api.getEstadosCivilByID(estadoCivilID);

            if (estadoCivilObtenido.estadoCivil.estado_civil === estadoCivil.estado_civil && estadoCivilObtenido.estadoCivil.estatus_general === estadoCivil.estatus_general) {
              const modal = document.querySelector('modal-warning')
              modal.message = 'No se han realizado cambios en el estado civil, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#estadoCivil.value = '';
              this.#estatusEstadoCivil.value = '0';
              this.#idSeleccion = null;
            }
            else {
              const response = await this.#api.putEstadosCivil(estadoCivilID, estadoCivil);
              if (response) {
                this.#estadoCivil.value = '';
                this.#estatusEstadoCivil.value = '0';
                this.#idSeleccion = null;
                this.mostrarEstadosCiviles();
              }
            }

          }

        }
      } catch (error) {
        console.error('Error al editar el estado civil:', error);
      }

    }

  }


  mostrarEstadosCiviles = async () => {

    try {
      const estadosCivil = await this.#api.getEstadosCiviles();
      const tableBody = this.#estadoCiviles;
      tableBody.innerHTML = '';
      const lista = estadosCivil.estadosCiviles;
      lista.forEach(estado => {
        const row = document.createElement('tr');
        row.innerHTML = `
          <tr id="estado-civil-${estado.id_estado_civil}">
          <td class="px-6 py-4 whitespace-nowrap">${estado.id_estado_civil}</td>
          <td class="px-6 py-4 whitespace-nowrap">${estado.estado_civil}</td>
          <td class="px-6 py-4 whitespace-nowrap">${estado.estatus_general}</td>
          <td class="px-6 py-4 whitespace-nowrap">
          <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-estado-civil" onclick="llamarActivarBotonSeleccionar(this.value)" value="${estado.id_estado_civil}">
          Seleccionar
        </button>
      
          </td>
      </tr>
          `;
        tableBody.appendChild(row);
      });
    } catch (error) {
      console.error('Error al obtener los estados civil:', error);
    }
  }


  activarBotonSeleccionar = async estadoCivilId => {

    try {

      const estadoCivilID = await this.#api.getEstadosCivilByID(estadoCivilId);
      if (estadoCivilID) {
        this.#idSeleccion = estadoCivilID.estadoCivil.id_estado_civil;
        this.#estadoCivil.value = estadoCivilID.estadoCivil.estado_civil;
        this.#estatusEstadoCivil.value = estadoCivilID.estadoCivil.estatus_general;
      } else {
        console.error('El estado civil con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener el estado civil por ID:', error);
    }

  }

}

customElements.define('estadocivil-tab', EstadoTab);
