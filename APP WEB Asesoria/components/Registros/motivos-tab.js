//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'

const template = document.createElement('template');
const html = await (
  await fetch('./components/Registros/motivos-tab.html')
).text()
template.innerHTML = html

class MotivosTab extends HTMLElement {
  #motivo
  #estatusMotivo
  #motivos
  #idSeleccion

  #api

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
    this.#motivo = this.shadowRoot.getElementById('motivo');
    this.#estatusMotivo = this.shadowRoot.getElementById('estatus-motivo');
    this.#motivos = this.shadowRoot.getElementById('table-motivo');

    var motivoInput = this.#motivo;

    motivoInput.addEventListener('input', function () {
      if (motivoInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de motivo es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true

      }
      else if (motivoInput.value.length > 75) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de motivo no puede contener más de 75 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
  }

  fillInputs() {
    this.agregarEventosBotones();
    this.mostrarMotivos();

  }

  agregarEventosBotones = () => {

    const agregarMotivoBtn = this.shadowRoot.getElementById('agregar-motivo');

    agregarMotivoBtn.addEventListener('click', this.agregarMotivo);

    const editarMotivoBtn = this.shadowRoot.getElementById('editar-motivo');
    editarMotivoBtn.addEventListener('click', this.editarMotivo);

    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-motivo');
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const motivoId = boton.value;
        console.log(motivoId);
        this.#idSeleccion = motivoId;
        this.activarBotonSeleccionar(motivoId);
      });
    });

    const llamarActivarBotonSeleccionar = (motivoId) => {
      this.activarBotonSeleccionar(motivoId);
    };

    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
  }

  agregarMotivo = async () => {

    const motivoID = this.#idSeleccion;

    if (motivoID === null) {
      const motivoInput = this.#motivo.value;
      const estatusMotivoInput = this.#estatusMotivo.value;

      try {
        if (motivoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de motivo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusMotivoInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de motivo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (motivoInput !== '' && estatusMotivoInput !== '0') {
          if (motivoInput.length > 75) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de motivo no puede contener más de 75 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {

            const nuevoMotivo = {
              descripcion_motivo: motivoInput,
              estatus_general: estatusMotivoInput.toUpperCase()
            };

            const response = await this.#api.postMotivo(nuevoMotivo);

            if (response) {
              this.#motivo.value = '';
              this.#estatusMotivo.value = '0';
              this.#idSeleccion = null;
              this.mostrarMotivos();
            }
          }
        }

      } catch (error) {
        console.error('Error al agregar un nuevo motivo:', error);
      }
    } else {
      const modal = document.querySelector('modal-warning')
      modal.message = 'No se puede agregar un nuevo motivo si ya se ha seleccionado uno, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#motivo.value = '';
      this.#estatusMotivo.value = '0';
      this.#idSeleccion = null;
      this.mostrarMotivos();
    }
  }

  editarMotivo = async () => {
 
    const motivoID = this.#idSeleccion;
    if (motivoID === null) {
      const modal = document.querySelector('modal-warning')
      modal.message = 'Debe seleccionar un motivo para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {

      const motivoInput = this.#motivo.value;
      const estatusMotivoInput = this.#estatusMotivo.value;

      try {
        if (motivoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de motivo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusMotivoInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de motivo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (motivoInput !== '' && estatusMotivoInput !== '0') {
          if (motivoInput.length > 75) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de motivo no puede contener más de 75 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {

            const motivo = {
              id_motivo: motivoID,
              descripcion_motivo: motivoInput,
              estatus_general: estatusMotivoInput.toUpperCase()
            };

            const motivoObtenido = await this.#api.getMotivoByID(motivoID);

            if (motivoObtenido.motivo.descripcion_motivo === motivo.descripcion_motivo && motivoObtenido.motivo.estatus_general === motivo.estatus_general) {

              const modal = document.querySelector('modal-warning')
              modal.message = 'No se han realizado cambios en el motivo, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#motivo.value = '';
              this.#estatusMotivo.value = '0';
              this.#idSeleccion = null;

            } else {

              const response = await this.#api.putMotivo(motivoID, motivo);

              if (response) {
                this.#motivo.value = '';
                this.#estatusMotivo.value = '0';
                this.#idSeleccion = null;
                this.mostrarMotivos();
              }

            }
          }
        }
      } catch (error) {
        console.error('Error al editar el motivo:', error);
      }
    }


  }

  mostrarMotivos = async () => {
    try {

      const motivos = await this.#api.getMotivos();
      const motivosTable = this.#motivos;
      motivosTable.innerHTML = '';
      const lista = motivos.motivos;

      const funcion =
        lista.forEach(motivo => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <tr id="motivo-${motivo.id_motivo}">
            <td class="px-6 py-4 whitespace-nowrap">${motivo.id_motivo}</td>
            <td class="px-6 py-4 whitespace-nowrap">${motivo.descripcion_motivo}</td>
            <td class="px-6 py-4 whitespace-nowrap">${motivo.estatus_general}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-motivo" onclick="llamarActivarBotonSeleccionar(this.value)" value="${motivo.id_motivo}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `;
          motivosTable.appendChild(row);
        });

    } catch (error) {
      console.error('Error al obtener los motivos:', error);

    }

  }

  activarBotonSeleccionar = async motivoId => {

    try {
      const motivoID = await this.#api.getMotivoByID(motivoId);
      if (motivoID) {
        this.#idSeleccion = motivoID.motivo.id_motivo;
        this.#motivo.value = motivoID.motivo.descripcion_motivo;
        this.#estatusMotivo.value = motivoID.motivo.estatus_general;
      } else {
        console.error('El motivo con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener el motivo por ID:', error);
    }
  }
}

customElements.define('motivo-tab', MotivosTab);
