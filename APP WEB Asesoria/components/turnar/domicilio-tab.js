import { APIModel } from '../../models/api.model'


const template = document.createElement('template')

const html = await (await fetch('../assets/turnar/domicilio-tab.html')).text()
template.innerHTML = html

export class DomicilioTab extends HTMLElement {

  #API

  #asesoria
  #domicilio

  #calle
  #numeroExt
  #numeroInt
  #cp
  #municipio
  #estado
  #ciudad
  #colonia
  #botonbuscar
  #editCbx
  static get observedAttributes() {
    return ['id', 'data']
  }

  constructor() {
    super()
    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))
    this.id = 'domicilio'
    this.style.display = 'none'

    this.#asesoria = JSON.parse(sessionStorage.getItem('asesoria'))
    this.#domicilio = JSON.parse(sessionStorage.getItem('colonia'))
    this.#API = new APIModel()

    this.manageFormFields()
    this.fillInputs()
    /*

    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.handleFiltros();
    });

*/

    this.formCP = this.shadowRoot.getElementById('buscar-cp')

    this.formCP.addEventListener('click', (event) => {
      event.preventDefault();
      if (
        !this.#cp.value ||
        this.#cp.value.length !== 5 ||
        isNaN(this.#cp.value)
      ) {
        this.#showModal('El código postal debe tener 5 dígitos', 'Advertencia')
        return
      }
      this.searchCP()
    })


  }

  manageFormFields() {
    this.#calle = this.shadowRoot.getElementById('calle')
    this.#numeroExt = this.shadowRoot.getElementById('numero-ext')
    this.#numeroInt = this.shadowRoot.getElementById('numero-int')
    this.#cp = this.shadowRoot.getElementById('codigo-postal')
    this.#municipio = this.shadowRoot.getElementById('municipio')
    this.#estado = this.shadowRoot.getElementById('estado')
    this.#ciudad = this.shadowRoot.getElementById('ciudad')
    this.#colonia = this.shadowRoot.getElementById('colonia')
    this.#botonbuscar = this.shadowRoot.getElementById('buscar-cp')
    this.#editCbx = this.shadowRoot.getElementById('cbx-editable-domicilio')

    var editableCbx = this.#editCbx;
    var calleInput = this.#calle;

    calleInput.addEventListener('input', function () {
      if (editableCbx.checked) {
        if (calleInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.message = 'La calle no puede estar vacía, por favor ingresela.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else if (calleInput.value.length > 75) {
          const modal = document.querySelector('modal-warning');
          modal.message = 'La calle no puede tener más de 75 caracteres, por favor ingresela correctamente.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      }

    });






    var numeroExteriorInput = this.#numeroExt;
    var numeroInteriorInput = this.#numeroExt;

    var enterosPattern = /^\d+$/;


    numeroExteriorInput.addEventListener('input', function () {

      if (editableCbx.checked) {


        if (!enterosPattern.test(numeroExteriorInput.value)) {
          const modal = document.querySelector('modal-warning');
          modal.message = 'El número exterior solo permite números, verifique su respuesta.';
          modal.title = 'Error de validación';
          modal.open = true;
        } if (numeroExteriorInput.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.message = 'El número exterior no puede estar vacío, por favor ingreselo.';
          modal.title = 'Error de validación';
          modal.open = true;
        } else if (numeroExteriorInput.value.length > 10) {
          const modal = document.querySelector('modal-warning');
          modal.message = 'El número exterior no debe tener más de 10 dígitos, por favor ingreselo correctamente.';
          modal.title = 'Error de validación';
          modal.open = true;
        }
      }
    });
    numeroInteriorInput.addEventListener('input', function () {
      if (editableCbx.checked) {

        if (numeroInteriorInput.value !== '') {
          if (!enterosPattern.test(numeroInteriorInput.value)) {
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
      }
    });



  }

  fillInputs() {
    this.#calle.value = this.#asesoria.persona.domicilio.calle_domicilio
    this.#numeroExt.value =
      this.#asesoria.persona.domicilio.numero_exterior_domicilio
    this.#numeroInt.value =
      this.#asesoria.persona.domicilio.numero_interior_domicilio
    this.#cp.value = this.#domicilio.codigo_postal.codigo_postal
    this.#municipio.value = this.#domicilio.municipio.nombre_municipio
    this.#estado.value = this.#domicilio.estado.nombre_estado
    this.#ciudad.value = this.#domicilio.ciudad.nombre_ciudad


    this.#API.getDomicilioByCP(this.#cp.value)
      .then(data => {
        //console.log(data);
        const selectColonia = this.shadowRoot.getElementById('colonia'); // Aquí obtenemos la referencia al elemento <select>
        // Verificamos si selectColonia es válido
        if (selectColonia) {
          // Iteramos sobre los datos y agregamos las opciones al elemento <select>
          const coloniasArray = Array.from(data.colonias.colonias);

          // Iteramos sobre los datos y agregamos las opciones al elemento <select>
          coloniasArray.forEach(colonia => {
            const option = document.createElement('option');
            option.value = colonia.id_colonia;
            option.textContent = colonia.nombre_colonia;
            selectColonia.appendChild(option);
          });

          //console.log(    data   )
          selectColonia.value = this.#domicilio.colonia.id_colonia;

        } else {
          //   console.error('Elemento "colonia" no encontrado en el shadow DOM.');
        }
      })
      .catch(error => {
        // console.error('Error al obtener datos de la API:', error);
      });




  }

  connectedCallback() {
    this.btnNext = this.shadowRoot.getElementById('btn-domicilio-next')
    this.editCbx = this.shadowRoot.getElementById('cbx-editable-domicilio')

    this.btnNext.addEventListener('click', () => {
      const event = new CustomEvent('next', {
        bubbles: true,
        composed: true,
        detail: { tabId: 'turno' },
      })
      this.dispatchEvent(event)
    })

    this.editCbx.addEventListener('change', () => {
      this.#toggleInputDisabled()
    })


  }
/*
  async searchCP() {
    try {

   //   const selectColonia = this.shadowRoot.getElementById('colonia'); // Aquí obtenemos la referencia al elemento <select>
   //   var coloniaobjeto=  selectColonia
   //   var colonia_valor= coloniaobjeto.value

     await  this.#API.getDomicilioByCP(this.#cp.value)
        .then(data => {
         console.log(data);
         const selectColonia = this.shadowRoot.getElementById('colonia'); // Aquí obtenemos la referencia al elemento <select>
          // Verificamos si selectColonia es válido


            //    this.#calle.value =""
            //    this.#numeroExt.value =""
            //    this.#numeroInt.value =""
            //    this.#cp.value = ""
            this.#municipio.value = ""
            this.#estado.value = ""
            this.#ciudad.value = ""
            while (selectColonia.firstChild) {
              selectColonia.removeChild(selectColonia.firstChild);
            }

//            const coloniasArray = Array.from();

            data.colonias.forEach(colonia => {
              const option = document.createElement('option');
              option.value = colonia.id_colonia;
              option.textContent = colonia.nombre_colonia;
              selectColonia.appendChild(option);
            });


            //    selectColonia.value = this.#domicilio.colonia.id_colonia;
/*
            // Verificar y establecer el valor seleccionado
            const selectedColoniaId = this.#domicilio.colonia.id_colonia;
            if (selectedColoniaId) {
              const optionExists = Array.from(selectColonia.options).some(option => option.value === selectedColoniaId);
              if (optionExists) {
                selectColonia.value = selectedColoniaId;
              }
            }
  */


            //   this.#calle.value = data.colonias.domicilio.calle_domicilio
            //      this.#numeroExt.value =data.colonias.domicilio.numero_exterior_domicilio
            //    this.#numeroInt.value =data.colonias.domicilio.numero_interior_domicilio
            //    this.#cp.value = data.colonias.codigo_postal.codigo_postal
      /*      this.#municipio.value = data.colonias.municipio.nombre_municipio
            this.#estado.value = data.colonias.estado.nombre_estado
            this.#ciudad.value = data.colonias.ciudad.nombre_ciudad



       
        })
        .catch(error => {
          // console.error('Error al obtener datos de la API:', error);
          console.error(error)
          this.#showModal('Error al buscar el código postal', 'Error')
        });


*/

      /*
      const { colonias: data } = await this.#API.getDomicilioByCP(
        this.#cp.value
      )
      if (!data || typeof data === 'string') {
        this.#showModal('No se encontró el código postal', 'Advertencia')
        return
      }
      this.#estado.innerHTML='';
      this.#estado.value = data.estado.nombre_estado
      this.#municipio.innerHTML = '';
      this.#municipio.value = data.municipio.nombre_municipio
      this.#ciudad.innerHTML = '';
      this.#ciudad.value = data.ciudad.nombre_ciudad
      this.#colonia.innerHTML = '';
      data.colonias.forEach(colonia => {
        const option = document.createElement('option')
        option.value = colonia.id_colonia
        option.textContent = colonia.nombre_colonia
        this.#colonia.appendChild(option)
      })
      */
  /*  } catch (error) {
      console.error(error)
      this.#showModal('Error al buscar el código postal', 'Error')
    }
  } 

*/

  
  async searchCP() {
    try {
      const { colonias: data } = await this.#API.getDomicilioByCP(
        this.#cp.value
      )
      if (!data || typeof data === 'string') {
        this.#showModal('No se encontró el código postal', 'Advertencia')
        return
      }
      this.#estado.innerHTML='';
      this.#estado.value = data.estado.nombre_estado
      this.#municipio.innerHTML = '';
      this.#municipio.value = data.municipio.nombre_municipio
      this.#ciudad.innerHTML = '';
      this.#ciudad.value = data.ciudad.nombre_ciudad
      this.#colonia.innerHTML = '';
      data.colonias.forEach(colonia => {
        const option = document.createElement('option')
        option.value = colonia.id_colonia
        option.textContent = colonia.nombre_colonia
        this.#colonia.appendChild(option)
      })
    } catch (error) {
      console.error(error)
      this.#showModal('Error al buscar el código postal', 'Error')
    }
  }

  #showModal(message, title, onCloseCallback) {
    const modal = document.querySelector('modal-warning')
    modal.message = message
    modal.title = title
    modal.open = true
    modal.setOnCloseCallback(onCloseCallback)
  }

  #toggleInputDisabled() {
    // Habilitar o deshabilitar inputs: calle, numeroExt, numeroInt
    this.#calle.disabled = !this.#calle.disabled
    this.#numeroExt.disabled = !this.#numeroExt.disabled
    this.#numeroInt.disabled = !this.#numeroInt.disabled
    this.#cp.disabled = !this.#cp.disabled
    this.#botonbuscar.disabled = !this.#botonbuscar.disabled
    this.#colonia.disabled = !this.#colonia.disabled
  }

  get id() {
    return this.getAttribute('id')
  }

  set id(value) {
    this.setAttribute('id', value)
  }

  get data() {
    return {
      calle: this.#calle.value,
      numeroExt: this.#numeroExt.value,
      numeroInt: this.#numeroInt.value,
      cp: this.#cp.value,
      estado: this.#estado.value,
      municipio: this.#municipio.value,
      ciudad: this.#ciudad.value,
      colonia: this.#colonia.value,
    }
  }

  set data(value) {
    this.setAttribute('data', value)
  }
}

customElements.define('domicilio-tab', DomicilioTab)
