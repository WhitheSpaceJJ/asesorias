//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'



const template = document.createElement('template')

const html = await (
  await fetch('./components/Registros/catalogos-tab.html')
).text()
template.innerHTML = html

class CatalogosTab extends HTMLElement {
  #idSeleccion
  #api
  #catalogo
  #estatusCatalogo
  #catalogos

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


    this.#catalogo = this.shadowRoot.getElementById('catalogo');
    this.#estatusCatalogo = this.shadowRoot.getElementById('estatus-catalogo');
    this.#catalogos = this.shadowRoot.getElementById('table-catalogo');

    var catalogoInput = this.#catalogo;

    catalogoInput.addEventListener('input', function () {
      if (catalogoInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de catalogo es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true

      }
      else if (catalogoInput.value.length > 75) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de catalogo no puede contener más de 75 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
  }

  fillInputs() {
    this.agregarEventosBotones();
    this.mostrarCatalogos();
  }

  agregarEventosBotones = () => {

    const agregarCatalogoBtn = this.shadowRoot.getElementById('agregar-catalogo');

    agregarCatalogoBtn.addEventListener('click', this.agregarCatalogo);

    const editarCatalogoBtn = this.shadowRoot.getElementById('editar-catalogo');
    editarCatalogoBtn.addEventListener('click', this.editarCatalogo);

    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-catalogo');
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const catalogoId = boton.value;
        console.log(catalogoId);
        this.#idSeleccion = catalogoId;
        this.activarBotonSeleccionar(catalogoId);
      });
    });

    const llamarActivarBotonSeleccionar = (catalogoId) => {
      this.activarBotonSeleccionar(catalogoId);
    };

    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
  }

  agregarCatalogo = async () => {

    const catalogoID = this.#idSeleccion;

    if (catalogoID === null) {
      const catalogoInput = this.#catalogo.value;
      const estatusCatalogoInput = this.#estatusCatalogo.value;

      try {
        if (catalogoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de catalogo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusCatalogoInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de catalogo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (catalogoInput !== '' && estatusCatalogoInput !== '0') {
          if (catalogoInput.length > 75) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de catalogo no puede contener más de 75 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {

            const nuevoCatalogo = {
              descripcion_catalogo: catalogoInput,
              estatus_general: estatusCatalogoInput.toUpperCase()
            };

            const response = await this.#api.postCatalogos(nuevoCatalogo);

            if (response) {
              this.#catalogo.value = '';
              this.#estatusCatalogo.value = '0';
              this.#idSeleccion = null;
              this.mostrarCatalogos();
            }
          }
        }

      } catch (error) {
        console.error('Error al agregar un nuevo catalogo:', error);
      }
    } else {
      const modal = document.querySelector('modal-warning')
      modal.message = 'No se puede agregar un nuevo catalogo si ya se ha seleccionado uno, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#catalogo.value = '';
      this.#estatusCatalogo.value = '0';
      this.#idSeleccion = null;
      this.mostrarCatalogos();
    }
  }

  editarCatalogo = async () => {

    const catalogoID = this.#idSeleccion;
    if (catalogoID === null) {
      const modal = document.querySelector('modal-warning')
      modal.message = 'Debe seleccionar un catalogo para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {

      const catalogoInput = this.#catalogo.value;
      const estatusCatalogoInput = this.#estatusCatalogo.value;

      try {
        if (catalogoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de catalogo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusCatalogoInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de catalogo es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (catalogoInput !== '' && estatusCatalogoInput !== '0') {
          if (catalogoInput.length > 75) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de catalogo no puede contener más de 75 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else {
            const catalogo = {
              id_catalogo: catalogoID,
              descripcion_catalogo: catalogoInput,
              estatus_general: estatusCatalogoInput.toUpperCase()
            };

            const catalogoObtenido = await this.#api.getCatalogosByID(catalogoID);

            if (catalogoObtenido.requisitoCatalogo.descripcion_catalogo === catalogo.descripcion_catalogo && catalogoObtenido.requisitoCatalogo.estatus_general === catalogo.estatus_general) {
              const modal = document.querySelector('modal-warning')
              modal.message = 'No se han realizado cambios en el catalogo, ya que los datos son iguales a los actuales, se eliminaran los campos.'
              modal.title = 'Error de validación'
              modal.open = true
              this.#catalogo.value = '';
              this.#estatusCatalogo.value = '0';
              this.#idSeleccion = null;
            }
            else {
              const response = await this.#api.putCatalogos(catalogoID, catalogo);
              if (response) {
                this.#catalogo.value = '';
                this.#estatusCatalogo.value = '0';
                this.#idSeleccion = null;
                this.mostrarCatalogos();
              }

            }

          }
        }
      } catch (error) {
        console.error('Error al editar el catalogo:', error);

      }
    }


  }

  mostrarCatalogos = async () => {


    try {

      const catalogos = await this.#api.getCatalogos();
      const tableBody = this.#catalogos;
      tableBody.innerHTML = '';
      const lista = catalogos.requisitosCatalogo;
      const funcion =
        lista.forEach(catalogo => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <tr id="catalogo-${catalogo.id_catalogo}">
              <td class="px-6 py-4 whitespace-nowrap">${catalogo.id_catalogo}</td>
              <td class="px-6 py-4 whitespace-nowrap">${catalogo.descripcion_catalogo}</td>
              <td class="px-6 py-4 whitespace-nowrap">${catalogo.estatus_general}</td>
              <td class="px-6 py-4 whitespace-nowrap">
              <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-catalogo" onclick="llamarActivarBotonSeleccionar(this.value)" value="${catalogo.id_catalogo}">
              Seleccionar
            </button>
          
              </td>
          </tr>
              `;
          tableBody.appendChild(row);
        });
    } catch (error) {
      console.error('Error al obtener los catalogos:', error);
    }

  }



  activarBotonSeleccionar = async catalogoId => {

    try {

      const catalogoID = await this.#api.getCatalogosByID(catalogoId);
      console.log(catalogoID);
      if (catalogoID) {
        this.#idSeleccion = catalogoID.requisitoCatalogo.id_catalogo;
        this.#catalogo.value = catalogoID.requisitoCatalogo.descripcion_catalogo;
        this.#estatusCatalogo.value = catalogoID.requisitoCatalogo.estatus_general;
      } else {
        console.error('El catalogo con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener el catalogo por ID:', error);
    }

  }
}

customElements.define('catalogo-tab', CatalogosTab);
