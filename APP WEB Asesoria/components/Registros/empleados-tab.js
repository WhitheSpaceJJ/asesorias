import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'

const template = document.createElement('template')

const html = await (
  await fetch('/components/Registros/empleados-tab.html')
).text()
template.innerHTML = html

class EmpleadosTab extends HTMLElement {

  #nombre
  #apellidoPaterno
  #apellidoMaterno
  #tipoUsuario
  #estatusUsuario
  #distritoJudicial
  #empleados


  #api
  #idSeleccion

  #distritos


  constructor() {
    super();

    const shadow = this.attachShadow({ mode: 'open' })
    shadow.appendChild(template.content.cloneNode(true))
    this.#idSeleccion = null;

    this.init();

  }
  async init() {
    this.#api = new APIModel();
    this.#distritos = await this.#api.getDistritos()

    this.manageFormFields();
    this.fillInputs();

    var nombreInput = this.#nombre;
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

        } else if (nombreInput.value.length > 100) {
          // Si el campo tiene más de 50 caracteres, lanzar una excepción
          const modal = document.querySelector('modal-warning')
          modal.message = 'El nombre no puede tener más de 100 caracteres, por favor ingréselo correctamente.'
          modal.title = 'Error de validación'
          modal.open = true
        }
    });



  }
  manageFormFields() {
    this.#nombre = this.shadowRoot.getElementById('nombre');
    this.#apellidoPaterno = this.shadowRoot.getElementById('apellido-paterno');
    this.#apellidoMaterno = this.shadowRoot.getElementById('apellido-materno');
    this.#tipoUsuario = this.shadowRoot.getElementById('tipo-usuario');
    this.#estatusUsuario = this.shadowRoot.getElementById('estatus-empleado');
    this.#distritoJudicial = this.shadowRoot.getElementById('distrito-judicial');
    this.#empleados = this.shadowRoot.getElementById('table-empleado');




  }

  fillInputs() {
    this.agregarEventosBotones();
    this.mostrarEmpleados();

    this.rellenarDistritosJudiciales();
  }

  rellenarDistritosJudiciales = async () => {

    this.#distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distritoJudicial.appendChild(option)
    })
  }


  agregarEventosBotones = () => {
    //Agregar boton
    const agregarEmpleadoBtn = this.shadowRoot.getElementById('agregar-empleado');

    agregarEmpleadoBtn.addEventListener('click', this.agregarEmpleado);

    //Editar boton
    const editarEmpleadoBtn = this.shadowRoot.getElementById('editar-empleado');
    editarEmpleadoBtn.addEventListener('click', this.editarEmpleado);

    //Seleccionar boton
    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-empleado');

    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const empleadoId = boton.dataset.id;
        this.#idSeleccion = empleadoId;
        this.activarBotonSeleccionar(empleadoId);
      });
    });

    // Nueva función para llamar a activarBotonSeleccionar dentro del contexto de la instancia actual de JuicioController
    const llamarActivarBotonSeleccionar = (empleadoId) => {
      this.activarBotonSeleccionar(empleadoId);
    };

    // Agregar la función llamarActivarBotonSeleccionar al ámbito global para que se pueda llamar desde el atributo onclick de los botones "Seleccionar"
    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
  }
  /*
    agregarEmpleado = async () => {
  
      const idEmpleado = this.#idSeleccion;
  
      if (idEmpleado === null) {
  
  
        const nombreInput = this.#nombre.value;
        const tipoUsuarioInput = this.#tipoUsuario.value;
        const estatusUsuarioInput = this.#estatusUsuario.value;
        const distritoJudicialInput = this.#distritoJudicial.value;
  
        try {
          var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
  
          if (nombreInput === '') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de nombre es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
          if (tipoUsuarioInput === '0') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de tipo de usuario es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
          if (estatusUsuarioInput === '0') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de estatus de usuario es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
          if (distritoJudicialInput === '0') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de distrito judicial es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
          if (nombreInput !== '' && tipoUsuarioInput !== '0' && estatusUsuarioInput !== '0' && distritoJudicialInput !== '0') {
            if (nombreInput.length > 100) {
              const modal = document.querySelector('modal-warning')
              modal.message = 'El campo de nombre no puede contener más de 100 caracteres.'
              modal.title = 'Error de validación'
              modal.open = true
            } else if (!nombrePattern.test(nombreInput)) {
              const modal = document.querySelector('modal-warning')
              modal.message = 'El nombre solo permite letras, verifique su respuesta.'
              modal.title = 'Error de validación'
              modal.open = true
  
            }
            else {
              const nuevoEmpleado = {
                nombre: this.#nombre.value,
                tipo_empleado:  this.#tipoUsuario.value,
                estatus_general: this.#estatusUsuario.value.toUpperCase(),
                id_distrito_judicial: this.#distritoJudicial.value
              };
              console.log(nuevoEmpleado)
  
              const response = await this.#api.postEmpleado(nuevoEmpleado);
  
              if (response) {
                this.#nombre.value = '';
                this.#tipoUsuario.value = '0';
                this.#estatusUsuario.value = '0';
                this.#distritoJudicial.value = '0';
                this.#idSeleccion = null;
                this.mostrarEmpleados();
              }
            }
  
  
  
          }
  
  
        } catch (error) {
          console.error('Error al agregar un nuevo empleado:', error);
        }
      } else {
        const modal = document.querySelector('modal-warning')
        modal.message = 'No se puede agregar un empleado si se ha seleccionado uno para editar, se eliminará la selección.'
        modal.title = 'Error de validación'
        modal.open = true
        this.#idSeleccion = null;
        this.#nombre.value = '';
        this.#tipoUsuario.value = '0';
        this.#estatusUsuario.value = '0';
        this.#distritoJudicial.value = '0';
      }
    }
  
    editarEmpleado = async () => {
      const idEmpleado = this.#idSeleccion;
  
      if (idEmpleado === null) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'Por favor seleccione un empleado para editar.'
        modal.title = 'Error de validación'
        modal.open = true
      }
      else {
        const nombreInput = this.#nombre.value;
        const tipoUsuarioInput = this.#tipoUsuario.value;
        const estatusUsuarioInput = this.#estatusUsuario.value;
        const distritoJudicialInput = this.#distritoJudicial.value;
  
        try {
          var nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;
  
          if (nombreInput === '') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de nombre es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
          if (tipoUsuarioInput === '0') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de tipo de usuario es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
          if (estatusUsuarioInput === '0') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de estatus de usuario es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
  
          if (distritoJudicialInput === '0') {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de distrito judicial es obligatorio.'
            modal.title = 'Error de validación'
            modal.open = true
          }
  
  
          if (nombreInput !== '' && tipoUsuarioInput !== '0' && estatusUsuarioInput !== '0' && distritoJudicialInput !== '0') {
            if (nombreInput.length > 100) {
              const modal = document.querySelector('modal-warning')
              modal.message = 'El campo de nombre no puede contener más de 100 caracteres.'
              modal.title = 'Error de validación'
              modal.open = true
            } else if (!nombrePattern.test(nombreInput)) {
              const modal = document.querySelector('modal-warning')
              modal.message = 'El nombre solo permite letras, verifique su respuesta.'
              modal.title = 'Error de validación'
              modal.open = true
  
            } else {
              const empleado = {
                nombre: this.#nombre.value,
                tipo_empleado: this.#tipoUsuario.value ,
                estatus_general: this.#estatusUsuario.value.toUpperCase(),
                id_distrito_judicial: this.#distritoJudicial.value
              };
                     
              console.log(empleado)
              console.log(this.#idSeleccion)
  
              const response = await this.#api.putEmpleado(this.#idSeleccion, empleado);
  
              if (response) {
                this.#nombre.value = '';
                this.#tipoUsuario.value = '0';
                this.#estatusUsuario.value = '0';
                this.#distritoJudicial.value = '0';
                this.#idSeleccion = null;
                this.mostrarEmpleados();
              }
  
            }
  
          }
        } catch (error) {
          console.error('Error al editar el empleado:', error);
        }
      }
    }
  
  */
  agregarEmpleado = async () => {
    const idEmpleado = this.#idSeleccion;
    let modal;

    if (idEmpleado === null) {
      const nombreInput = this.#nombre.value;
      const tipoUsuarioInput = this.#tipoUsuario.value;
      const estatusUsuarioInput = this.#estatusUsuario.value;
      const distritoJudicialInput = this.#distritoJudicial.value;

      try {
        const nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

        if (nombreInput === '') {
          modal = document.querySelector('modal-warning');
          modal.message = 'El campo de nombre es obligatorio.';
          modal.title = 'Error de validación';
          modal.open = true;
        }

        if (tipoUsuarioInput === '0') {
          modal = document.querySelector('modal-warning');
          modal.message = 'El campo de tipo de usuario es obligatorio.';
          modal.title = 'Error de validación';
          modal.open = true;
        }

        if (estatusUsuarioInput === '0') {
          modal = document.querySelector('modal-warning');
          modal.message = 'El campo de estatus de usuario es obligatorio.';
          modal.title = 'Error de validación';
          modal.open = true;
        }

        if (distritoJudicialInput === '0') {
          modal = document.querySelector('modal-warning');
          modal.message = 'El campo de distrito judicial es obligatorio.';
          modal.title = 'Error de validación';
          modal.open = true;
        }

        if (nombreInput !== '' && tipoUsuarioInput !== '0' && estatusUsuarioInput !== '0' && distritoJudicialInput !== '0') {
          if (nombreInput.length > 100) {
            modal = document.querySelector('modal-warning');
            modal.message = 'El campo de nombre no puede contener más de 100 caracteres.';
            modal.title = 'Error de validación';
            modal.open = true;
          } else if (!nombrePattern.test(nombreInput)) {
            modal = document.querySelector('modal-warning');
            modal.message = 'El nombre solo permite letras, verifique su respuesta.';
            modal.title = 'Error de validación';
            modal.open = true;
          } else {
            const nuevoEmpleado = {
              nombre: this.#nombre.value,
              tipo_empleado: this.#tipoUsuario.value,
              estatus_general: this.#estatusUsuario.value.toUpperCase(),
              id_distrito_judicial: this.#distritoJudicial.value
            };
            //    console.log(nuevoEmpleado);

            const response = await this.#api.postEmpleado(nuevoEmpleado);

            if (response) {
              this.#nombre.value = '';
              this.#tipoUsuario.value = '0';
              this.#estatusUsuario.value = '0';
              this.#distritoJudicial.value = '0';
              this.#idSeleccion = null;
              this.mostrarEmpleados();
            }
          }
        }
      } catch (error) {
        console.error('Error al agregar un nuevo empleado:', error);
      }
    } else {
      modal = document.querySelector('modal-warning');
      modal.message = 'No se puede agregar un empleado si se ha seleccionado uno para editar, se eliminará la selección.';
      modal.title = 'Error de validación';
      modal.open = true;
      this.#idSeleccion = null;
      this.#nombre.value = '';
      this.#tipoUsuario.value = '0';
      this.#estatusUsuario.value = '0';
      this.#distritoJudicial.value = '0'; 
      this.liberarTipoEmpleado();
    }
  };

  editarEmpleado = async () => {
    const idEmpleado = this.#idSeleccion;
    let modal;

    if (idEmpleado === null) {
      modal = document.querySelector('modal-warning');
      modal.message = 'Por favor seleccione un empleado para editar.';
      modal.title = 'Error de validación';
      modal.open = true;
    } else {
      const nombreInput = this.#nombre.value;
      const tipoUsuarioInput = this.#tipoUsuario.value;
      const estatusUsuarioInput = this.#estatusUsuario.value;
      const distritoJudicialInput = this.#distritoJudicial.value;

      try {
        const nombrePattern = /^[A-Za-zÁáÉéÍíÓóÚúÑñ\s']+$/;

        if (nombreInput === '') {
          modal = document.querySelector('modal-warning');
          modal.message = 'El campo de nombre es obligatorio.';
          modal.title = 'Error de validación';
          modal.open = true;
        }

        if (tipoUsuarioInput === '0') {
          modal = document.querySelector('modal-warning');
          modal.message = 'El campo de tipo de usuario es obligatorio.';
          modal.title = 'Error de validación';
          modal.open = true;
        }

        if (estatusUsuarioInput === '0') {
          modal = document.querySelector('modal-warning');
          modal.message = 'El campo de estatus de usuario es obligatorio.';
          modal.title = 'Error de validación';
          modal.open = true;
        }

        if (distritoJudicialInput === '0') {
          modal = document.querySelector('modal-warning');
          modal.message = 'El campo de distrito judicial es obligatorio.';
          modal.title = 'Error de validación';
          modal.open = true;
        }

        if (nombreInput !== '' && tipoUsuarioInput !== '0' && estatusUsuarioInput !== '0' && distritoJudicialInput !== '0') {
          if (nombreInput.length > 100) {
            modal = document.querySelector('modal-warning');
            modal.message = 'El campo de nombre no puede contener más de 100 caracteres.';
            modal.title = 'Error de validación';
            modal.open = true;
          } else if (!nombrePattern.test(nombreInput)) {
            modal = document.querySelector('modal-warning');
            modal.message = 'El nombre solo permite letras, verifique su respuesta.';
            modal.title = 'Error de validación';
            modal.open = true;
          } else {
            const empleado = {
              nombre: this.#nombre.value,
              tipo_empleado: this.#tipoUsuario.value,
              estatus_general: this.#estatusUsuario.value.toUpperCase(),
              id_distrito_judicial: parseInt(this.#distritoJudicial.value)
            };

            if (empleado.tipo_empleado === 'asesor') {
              const { asesor } = await this.#api.getAsesorID(this.#idSeleccion);

              if (asesor.nombre_asesor === empleado.nombre && asesor.empleado.tipo_empleado === empleado.tipo_empleado && asesor.empleado.estatus_general === empleado.estatus_general && asesor.empleado.id_distrito_judicial === empleado.id_distrito_judicial) {
                modal = document.querySelector('modal-warning');
                modal.message = 'No se realizaron cambios en el empleado, ya que los datos son iguales a los actuales.';
                modal.title = 'Error de validación';
                modal.open = true;
                this.#nombre.value = '';
                this.#tipoUsuario.value = '0';
                this.#estatusUsuario.value = '0';
                this.#distritoJudicial.value = '0';
                this.#idSeleccion = null;
                this.liberarTipoEmpleado();
              }
              else { 
/*                if (asesor.empleado.tipo_empleado !== empleado.tipo_empleado) {
                  modal = document.querySelector('modal-warning');
                  modal.message = 'No se puede cambiar el tipo de empleado de un asesor.';
                  modal.title = 'Error de validación';
                  modal.open = true;
                } else {  */
                  const response = await this.#api.putEmpleado(this.#idSeleccion, empleado);
                  if (response) {
                    this.#nombre.value = '';
                    this.#tipoUsuario.value = '0';
                    this.#estatusUsuario.value = '0';
                    this.#distritoJudicial.value = '0';
                    this.#idSeleccion = null;
                    this.mostrarEmpleados();
                    this.liberarTipoEmpleado();
                  }
               // }
              }
            } else {
              const { defensor } = await this.#api.getDefensorID(this.#idSeleccion);
              if (defensor.nombre_defensor === empleado.nombre && defensor.empleado.tipo_empleado === empleado.tipo_empleado && defensor.empleado.estatus_general === empleado.estatus_general && defensor.empleado.id_distrito_judicial === empleado.id_distrito_judicial) {
                modal = document.querySelector('modal-warning');
                modal.message = 'No se realizaron cambios en el empleado, ya que los datos son iguales a los actuales.';
                modal.title = 'Error de validación';
                modal.open = true;
                this.#nombre.value = '';
                this.#tipoUsuario.value = '0';
                this.#estatusUsuario.value = '0';
                this.#distritoJudicial.value = '0';
                this.#idSeleccion = null;
                this.liberarTipoEmpleado();
              }
              else {
              /*  if (defensor.empleado.tipo_empleado !== empleado.tipo_empleado) {
                  modal = document.querySelector('modal-warning');
                  modal.message = 'No se puede cambiar el tipo de empleado de un defensor.';
                  modal.title = 'Error de validación';
                  modal.open = true;
                }
                else {
                  */
                  const response = await this.#api.putEmpleado(this.#idSeleccion, empleado);

                  if (response) {
                    this.#nombre.value = '';
                    this.#tipoUsuario.value = '0';
                    this.#estatusUsuario.value = '0';
                    this.#distritoJudicial.value = '0';
                    this.#idSeleccion = null;
                    this.mostrarEmpleados();
                    this.liberarTipoEmpleado();
                  }
                }
              //}

            }
          }
        }
      } catch (error) {
        console.error('Error al editar el empleado:', error);
      }
    }
  };


  mostrarEmpleados = async () => {

    try {
      const asesores = await this.#api.getAsesores();
      const defensores = await this.#api.getDefensores();
      const tableBody = this.#empleados;
      // Limpiar el cuerpo de la tabla antes de agregar nuevas filas
      tableBody.innerHTML = '';

      const asesoresArray = Object.values(asesores.asesores);

      asesoresArray.forEach(asesor => {

        const row = document.createElement('tr');
        row.innerHTML = `
        <tr id="empleado-${asesor.id_asesor}">
        <td class="px-6 py-4 whitespace-nowrap">${asesor.id_asesor}</td>
        <td class="px-6 py-4 whitespace-nowrap">${asesor.nombre_asesor}</td>
        <td class="px-6 py-4 whitespace-nowrap">${asesor.empleado.tipo_empleado}</td>
        <td class="px-6 py-4 whitespace-nowrap">${asesor.empleado.estatus_general}</td>
        <td class="px-6 py-4 whitespace-nowrap">${asesor.empleado.id_distrito_judicial}</td>
        <td class="px-6 py-4 whitespace-nowrap">
        <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-empleado" onclick="llamarActivarBotonSeleccionar(this.value)" value='{"id_asesor":${asesor.id_asesor},"tipo":"asesor"}'>
        Seleccionar
      </button>
    
        </td>
    </tr>
        `;
        tableBody.appendChild(row);



      });

      const defensoresArray = Object.values(defensores.defensores);

      defensoresArray.forEach(defensor => {

        const row = document.createElement('tr');
        row.innerHTML = `
        <tr id="empleado-${defensor.id_defensor}">
        <td class="px-6 py-4 whitespace-nowrap">${defensor.id_defensor}</td>
        <td class="px-6 py-4 whitespace-nowrap">${defensor.nombre_defensor}</td>
        <td class="px-6 py-4 whitespace-nowrap">${defensor.empleado.tipo_empleado}</td>
        <td class="px-6 py-4 whitespace-nowrap">${defensor.empleado.estatus_general}</td>
        <td class="px-6 py-4 whitespace-nowrap">${defensor.empleado.id_distrito_judicial}</td>
        <td class="px-6 py-4 whitespace-nowrap">
        <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-empleado" onclick="llamarActivarBotonSeleccionar(this.value)" value='{"id_asesor":${defensor.id_defensor},"tipo":"defensor"}'>
        Seleccionar
      </button>
    
        </td>
    </tr>
        `;
        tableBody.appendChild(row);

      });





    } catch (error) {
      console.error('Error al obtener los empleados:', error);
    }

  }

  bloquearTipoEmpleado = () => {
   this.#tipoUsuario.disabled = true;
  }
  
  liberarTipoEmpleado = () => {
    this.#tipoUsuario.disabled = false;
  }

  activarBotonSeleccionar = async (empleado) => {
    try {
      const tipoEmpleado = JSON.parse(empleado).tipo;

      if (tipoEmpleado === 'asesor') {
        const asesorID = JSON.parse(empleado).id_asesor;
        const { asesor } = await this.#api.getAsesorID(asesorID);
        //        console.log(asesor)
        this.#nombre.value = asesor.nombre_asesor;
        this.#tipoUsuario.value = asesor.empleado.tipo_empleado;
        this.#estatusUsuario.value = asesor.empleado.estatus_general;
        this.#distritoJudicial.value = asesor.empleado.id_distrito_judicial;
        this.#idSeleccion = asesor.id_asesor;
      }
      else {
        const defensorID = JSON.parse(empleado).id_asesor;
        const { defensor } = await this.#api.getDefensorID(defensorID);
        // console.log(defensor)
        this.#nombre.value = defensor.nombre_defensor;
        this.#tipoUsuario.value = defensor.empleado.tipo_empleado;
        this.#estatusUsuario.value = defensor.empleado.estatus_general;
        this.#distritoJudicial.value = defensor.empleado.id_distrito_judicial;
        this.#idSeleccion = defensor.id_defensor;
      }

      /*
            // Obtener el tipo de juicio por ID
            const tipoJuicioID = await this.#api.getTiposJuicioByID(tipoJuicioId);
            // Verificar si se encontró el tipo de juicio
            if (tipoJuicioID) {
              // Rellenar los campos de entrada con los valores de la fila seleccionada
              this.#idSeleccion = tipoJuicioID.tipoDeJuicio.id_tipo_juicio;
            //  this.#tipoJuicio.value = tipoJuicioID.tipoDeJuicio.tipo_juicio;
            //  this.#estatusJuicio.value = tipoJuicioID.tipoDeJuicio.estatus_general;
            } else {
              console.error('El empleado con el ID proporcionado no existe.');
            }
            */

            this.bloquearTipoEmpleado();


    } catch (error) {
      console.error('Error al obtener el empleado por ID:', error);
    }
  }
  /*
    async loadHTMLContent() {
      const response = await fetch('.);
      if (!response.ok) {
        throw new Error(`Failed to load HTML content: ${response.statusText}`);
      }
      return await response.text();
    }
    */
}

customElements.define('empleados-tab', EmpleadosTab);
