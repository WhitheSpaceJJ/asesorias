import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'

const template = document.createElement('template');
const html = await (
  await fetch('./components/Registros/generos-tab.html')
).text()
template.innerHTML = html


class GenerosTab extends HTMLElement {
  #genero
  #estatusGenero
  #generos
  #idSeleccion

  #api

  constructor() {
    super();
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))

    this.init();
  }

  async init() {
    this.#api = new APIModel();

    this.manageFormFields();
    this.fillInputs();

  }
  manageFormFields() {
    this.#genero = this.shadowRoot.getElementById('genero');
    this.#estatusGenero = this.shadowRoot.getElementById('estatus-genero');
    this.#generos = this.shadowRoot.getElementById('table-genero');

    var generoInput = this.#genero;

    generoInput.addEventListener('input', function () {
      if (generoInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de género es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true

      }
      else if (generoInput.value.length > 25) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de género no puede contener más de 100 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });

  }
  fillInputs() {
    this.mostrarGeneros();
    this.agregarEventosBotones();
  }
  agregarEventosBotones = () => {

    const agregarGeneroBtn = this.shadowRoot.getElementById('agregar-genero');

    agregarGeneroBtn.addEventListener('click', this.agregarGenero);

    const editarGeneroBtn = this.shadowRoot.getElementById('editar-genero');
    editarGeneroBtn.addEventListener('click', this.editarGenero);

    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-genero');
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const generoId = boton.value;
        console.log(generoId);
        this.#idSeleccion = generoId;
        this.activarBotonSeleccionar(generoId);
      });
    });

    const llamarActivarBotonSeleccionar = (generoId) => {
      this.activarBotonSeleccionar(generoId);
    };

    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
  }
  agregarGenero = async () => {
/*

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
*/
 
   const generoID = this.#idSeleccion;
     
      if (generoID === null) {
        const generoInput = this.#genero.value;
        const estatusGeneroInput = this.#estatusGenero.value;
  
        try {
          if (generoInput === '') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de género es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
          if (estatusGeneroInput === '0') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de estatus de género es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
          if (generoInput !== '' && estatusGeneroInput !== '0') {
            if (generoInput.length > 25) {
              const modal = document.querySelector('modal-warning')
              modal.message = 'El campo de género no puede contener más de 25 caracteres.'
              modal.title = 'Error de validación'
              modal.open = true
            }
            else {
  
              const nuevoGenero = {
                descripcion_genero: generoInput,
                estatus_general: estatusGeneroInput.toUpperCase()
              };
  
              const response = await this.#api.postGenero(nuevoGenero);
  
              if (response) {
                this.#genero.value = '';
                this.#estatusGenero.value = '0';
                this.#idSeleccion = null;
                this.mostrarGeneros();
              }
            }
          }
  
        } catch (error) {
          console.error('Error al agregar un nuevo género:', error);
        }
      } else {
        const modal = document.querySelector('modal-warning')
        modal.message = 'No se puede agregar un nuevo género si ya se ha seleccionado uno, se eliminaran los campos.'
        modal.title = 'Error de validación'
        modal.open = true
        this.#genero.value = '';
        this.#estatusGenero.value = '0';
        this.#idSeleccion = null;
        this.mostrarGeneros();
      }


  }
  editarGenero = async () => {

    const generoID = this.#idSeleccion;
    if (generoID === null) {
      const modal = document.querySelector('modal-warning')
      modal.message = 'Debe seleccionar un género para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {

      const generoInput = this.#genero.value;
      const estatusGeneroInput = this.#estatusGenero.value;

      try {
        if (generoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de género es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusGeneroInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de género es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (generoInput !== '' && estatusGeneroInput !== '0') {
          if (generoInput.length > 25) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de género no puede contener más de 25 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {

            const genero = {
              id_genero: generoID,
              descripcion_genero: generoInput,
              estatus_general: estatusGeneroInput.toUpperCase()
            };

            const generoObtenido = await this.#api.getGeneroByID(generoID);

            if (generoObtenido.genero.descripcion_genero === genero.descripcion_genero && generoObtenido.genero.estatus_general === genero.estatus_general) {

              const modal = document.querySelector('modal-warning')
              modal.message = 'No se han realizado cambios en el género, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#genero.value = '';
              this.#estatusGenero.value = '0';
              this.#idSeleccion = null;

            } else {

              const response = await this.#api.putGenero(generoID, genero);

              if (response) {
                this.#genero.value = '';
                this.#estatusGenero.value = '0';
                this.#idSeleccion = null;
                this.mostrarGeneros();
              }
            }
          } 
        }
      } catch (error) {
        console.error('Error al editar el género:', error);
      }
    }
  }


  mostrarGeneros = async () => {

    try {

      const generos = await this.#api.getGeneros();
      const generosTable = this.#generos;
      generosTable.innerHTML = '';
      const lista = generos.generos;

      const funcion =
        lista.forEach(genero => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <tr id="genero-${genero.id_genero}">
            <td class="px-6 py-4 whitespace-nowrap">${genero.id_genero}</td>
            <td class="px-6 py-4 whitespace-nowrap">${genero.descripcion_genero}</td>
            <td class="px-6 py-4 whitespace-nowrap">${genero.estatus_general}</td>
            <td class="px-6 py-4 whitespace-nowrap">
            <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-genero" onclick="llamarActivarBotonSeleccionar(this.value)" value="${genero.id_genero}">
            Seleccionar
          </button>
        
            </td>
        </tr>
            `;
          generosTable.appendChild(row);
        });

    } catch (error) {
      console.error('Error al obtener los generos:', error);

    }

  }
  activarBotonSeleccionar = async generoId => {
 
    try {

      const generoID = await this.#api.getGeneroByID(generoId);
      if (generoID) {
        this.#idSeleccion = generoID.genero.id_genero;
        this.#genero.value = generoID.genero.descripcion_genero;
        this.#estatusGenero.value = generoID.genero.estatus_general;
      } else {
        console.error('El genero con el ID proporcionado no existe.');
      }
    }
    catch (error) {
      console.error('Error al obtener el genero por ID:', error);
    }


  }
}

customElements.define('generos-tab', GenerosTab);
