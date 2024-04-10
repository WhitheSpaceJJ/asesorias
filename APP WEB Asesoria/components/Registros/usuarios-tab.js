//const template = document.createElement('template');
//import { ControllerUtils } from '......./lib/controllerUtils';
import { APIModel } from '../../models/api.model'
import { ValidationError } from '../../lib/errors.js'



const template = document.createElement('template')

const html = await (
  await fetch('./components/Registros/usuarios-tab.html')
).text()
template.innerHTML = html


class UsuariosTab extends HTMLElement {
  #api
  #idSeleccion
  #empleadoRadio
  #distritoRadio


  //Select
  #asesores
  #defensores
  #distritos
  #asesor
  #defensor
  #distrito

  #distrito2


  #asesorRadio
  #defensorRadio
  #bloqueOpciones
  #bloqueDistrito
  #bloqueAsesor
  #bloqueDefensor


  #nombre
  #apellidoPaterno
  #apellidoMaterno
  #correo
  #password
  #estatusUsuario

  #usuarios
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
    const { asesores } = await this.#api.getAsesores();
    const { defensores } = await this.#api.getDefensores();
    const distritos = await this.#api.getDistritos();


    this.#asesores = asesores;
    this.#defensores = defensores;
    this.#distritos = distritos;

    this.#asesores.forEach(asesor => {
      const option = document.createElement('option')
      const jsonValue = JSON.stringify({
        id_asesor: asesor.id_asesor,
        id_distrito_judicial: asesor.empleado.id_distrito_judicial
      });
      option.value = jsonValue;
      option.textContent = asesor.nombre_asesor
      this.#asesor.appendChild(option)
    })

    this.#defensores.forEach(defensor => {
      const option = document.createElement('option')
      const jsonValue = JSON.stringify({
        id_defensor: defensor.id_defensor,
        id_distrito_judicial: defensor.empleado.id_distrito_judicial
      });

      option.value = jsonValue
      option.textContent = defensor.nombre_defensor
      this.#defensor.appendChild(option)
    })

    this.#distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distrito.appendChild(option)
    })


    this.#distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.textContent = distrito.nombre_distrito_judicial
      this.#distrito2.appendChild(option)
    })


    this.eventosRadios();
    this.#asesor.addEventListener('change', this.handleAsesorChange);
    this.#defensor.addEventListener('change', this.handleDefensorChange);
  }
  handleAsesorChange = () => {
    const asesor = JSON.parse(this.#asesor.value);
    this.#distrito2.value = asesor.id_distrito_judicial;
  }
  handleDefensorChange = () => {
    const defensor = JSON.parse(this.#defensor.value);
    this.#distrito2.value = defensor.id_distrito_judicial;
  }

  manageFormFields() {

    this.#empleadoRadio = this.shadowRoot.getElementById('empleado');
    this.#distritoRadio = this.shadowRoot.getElementById('distrito');



    this.#asesor = this.shadowRoot.getElementById('asesor');
    this.#defensor = this.shadowRoot.getElementById('defensor');
    this.#distrito = this.shadowRoot.getElementById('distrito-judicial');

    this.#distrito2 = this.shadowRoot.getElementById('distrito-judicial2');


    this.#asesorRadio = this.shadowRoot.getElementById('asesor-option');
    this.#defensorRadio = this.shadowRoot.getElementById('defensor-option');

    this.#bloqueOpciones = this.shadowRoot.getElementById('bloque-opciones');
    this.#bloqueDistrito = this.shadowRoot.getElementById('bloque-distrito');
    this.#bloqueAsesor = this.shadowRoot.getElementById('bloque-asesor');
    this.#bloqueDefensor = this.shadowRoot.getElementById('bloque-defensor');

    this.#nombre = this.shadowRoot.getElementById('nombre');
    this.#apellidoPaterno = this.shadowRoot.getElementById('apellido-paterno');
    this.#apellidoMaterno = this.shadowRoot.getElementById('apellido-materno');
    this.#correo = this.shadowRoot.getElementById('correo-electronico');
    this.#password = this.shadowRoot.getElementById('password');

    this.#estatusUsuario = this.shadowRoot.getElementById('estatus-usuario');
    this.#usuarios = this.shadowRoot.getElementById('table-usuario');

    var nombreInput = this.#nombre;
    var apellidoPaternoInput = this.#apellidoPaterno;
    var apellidoMaternoInput = this.#apellidoMaterno;
    var correoInput = this.#correo;
    var passwordInput = this.#password;

    nombreInput.addEventListener('input', function () {
      if (nombreInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de nombre es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true
      }
      else if (nombreInput.value.length > 45) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de nombre no puede contener más de 45 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
    apellidoPaternoInput.addEventListener('input', function () {
      if (apellidoPaternoInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de apellido paterno es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true
      }
      else if (apellidoPaternoInput.value.length > 45) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de apellido paterno no puede contener más de 45 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
    apellidoMaternoInput.addEventListener('input', function () {
      if (apellidoMaternoInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de apellido materno es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true
      }
      else if (apellidoMaternoInput.value.length > 45) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de apellido materno no puede contener más de 45 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
    correoInput.addEventListener('input', function () {
      if (correoInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de correo electrónico es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true
      }
      else if (correoInput.value.length > 45) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de correo electrónico no puede contener más de 45 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });
    passwordInput.addEventListener('input', function () {
      if (passwordInput.value === '') {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de contraseña es obligatorio, no debe estar vacío.'
        modal.title = 'Error de validación'
        modal.open = true
      }
      else if (passwordInput.value.length > 65) {
        const modal = document.querySelector('modal-warning')
        modal.message = 'El campo de contraseña no puede contener más de 65 caracteres.'
        modal.title = 'Error de validación'
        modal.open = true
      }
    });


  }
  fillInputs() {
    this.agregarEventosBotones();
    this.mostrarUsuarios();

  }

  eventosRadios() {

    this.#empleadoRadio.addEventListener('change', this.handleRadioChange);
    this.#distritoRadio.addEventListener('change', this.handleRadioChange);
    this.#asesorRadio.addEventListener('change', this.handleRadioChange2);
    this.#defensorRadio.addEventListener('change', this.handleRadioChange2);
  }
  handleRadioChange2 = () => {
    // Hide or show fields based on selected radio button
    if (this.#empleadoRadio.checked) {
      if (this.#asesorRadio.checked) {
        this.#bloqueAsesor.classList.remove('hidden');
        this.#bloqueDefensor.classList.add('hidden');
      } else if (this.#defensorRadio.checked) {
        this.#bloqueDefensor.classList.remove('hidden');
        this.#bloqueAsesor.classList.add('hidden');
      }

    }

  }

  handleRadioChange = () => {
    // Hide or show fields based on selected radio button
    if (this.#empleadoRadio.checked) {
      this.#bloqueOpciones.classList.remove('hidden');
      this.#bloqueDistrito.classList.add('hidden');
    } else if (this.#distritoRadio.checked) {
      this.#bloqueOpciones.classList.add('hidden');
      this.#bloqueDistrito.classList.remove('hidden');
    }
  };
  agregarEventosBotones = () => {

    const agregarUsuarioBtn = this.shadowRoot.getElementById('agregar-usuario');
    agregarUsuarioBtn.addEventListener('click', this.agregarUsuario);

    const editarUsuarioBtn = this.shadowRoot.getElementById('editar-usuario');
    editarUsuarioBtn.addEventListener('click', this.editarUsuario);

    const seleccionarBotones = this.shadowRoot.querySelectorAll('.seleccionar-usuario');
    seleccionarBotones.forEach(boton => {
      boton.addEventListener('click', () => {
        const usuarioId = boton.value;
        this.#idSeleccion = usuarioId;
        this.activarBotonSeleccionar(usuarioId);
      });
    });

    const llamarActivarBotonSeleccionar = (usuarioId) => {
      this.activarBotonSeleccionar(usuarioId);
    }

    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;

  }



  agregarUsuario = async () => {


    const usuarioID = this.#idSeleccion;

    if (usuarioID === null) {

      const nombreInput = this.#nombre.value;
      const apellidoPaternoInput = this.#apellidoPaterno.value;
      const apellidoMaternoInput = this.#apellidoMaterno.value;
      const correoInput = this.#correo.value;
      const passwordInput = this.#password.value;
      const estatusUsuarioInput = this.#estatusUsuario.value;

      try {
        if (nombreInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de nombre es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (apellidoPaternoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de apellido paterno es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (apellidoMaternoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de apellido materno es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (correoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de correo electrónico es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (passwordInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de contraseña es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (estatusUsuarioInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de usuario es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (nombreInput !== '' && apellidoPaternoInput !== '' && apellidoMaternoInput !== '' && correoInput !== '' && passwordInput !== '' && estatusUsuarioInput !== '0') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (nombreInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de nombre no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else if (apellidoPaternoInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de apellido paterno no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true

          } else if (apellidoMaternoInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de apellido materno no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else if (correoInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de correo electrónico no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else if (!emailRegex.test(correoInput)) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El correo electrónico no es válido.'
            modal.title = 'Error de validación'
            modal.open = true

          }
          else if (passwordInput.length > 65) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de contraseña no puede contener más de 65 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else {
            if (this.#empleadoRadio.checked) {
              if (this.#asesorRadio.checked) {

                if (this.#asesor.value === '0') {
                  const modal = document.querySelector('modal-warning')
                  modal.message = 'Debe seleccionar un asesor para poder agregar un usuario.'
                  modal.title = 'Error de validación'
                  modal.open = true
                }

                else {
                  if (this.#distrito2.value === '0') {
                    const modal = document.querySelector('modal-warning')
                    modal.message = 'Debe seleccionar un distrito judicial para poder agregar un usuario.'
                    modal.title = 'Error de validación'
                    modal.open = true
                    this.resetRadioAndSelect();

                  } else {

                    const nombre_asesor_select = await this.#api.getAsesorID(JSON.parse(this.#asesor.value).id_asesor);
                    // Construye la expresión regular para el nombre completo del asesor
                    const nombreCompletoRegex = new RegExp(
                      `${nombreInput}\\s*${apellidoMaternoInput}\\s*${apellidoPaternoInput}`
                    );

                    if (!nombreCompletoRegex.test(nombre_asesor_select.asesor.nombre_asesor)) {
                      const modal = document.querySelector('modal-warning');
                      modal.message = 'El nombre del asesor seleccionado no coincide con el nombre ingresado.';
                      modal.title = 'Error de validación';
                      modal.open = true;
                    } else {
                      // Resto del código si la validación pasa

                      const usuario = {
                        nombre: nombreInput,
                        paterno: apellidoPaternoInput,
                        materno: apellidoMaternoInput,
                        correo: correoInput,
                        password: passwordInput,
                        id_distrito_judicial: this.#distrito2.value,
                        id_empleado: JSON.parse(this.#asesor.value).id_asesor,
                        estatus_general: estatusUsuarioInput.toUpperCase(),
                        id_tipouser: 2
                      };
                      const response = await this.#api.postUsuario(usuario);
                      if (response) {
                        this.#nombre.value = '';
                        this.#apellidoPaterno.value = '';
                        this.#apellidoMaterno.value = '';
                        this.#correo.value = '';
                        this.#password.value = '';
                        this.#estatusUsuario.value = '0';
                        this.mostrarUsuarios();
                        this.resetRadioAndSelect();
                      }
                    }
                  }
                }
              }
              else if (this.#defensorRadio.checked) {
                if (this.#defensor.value === '0') {
                  const modal = document.querySelector('modal-warning')
                  modal.message = 'Debe seleccionar un defensor para poder agregar un usuario.'
                  modal.title = 'Error de validación'
                  modal.open = true
                } else {
                  if (this.#distrito2.value === '0') {
                    const modal = document.querySelector('modal-warning')
                    modal.message = 'Debe seleccionar un distrito judicial para poder agregar un usuario.'
                    modal.title = 'Error de validación'
                    modal.open = true
                    this.resetRadioAndSelect();
                  } else {
                    const nombre_defensor_select = await this.#api.getDefensorID(JSON.parse(this.#defensor.value).id_defensor);


                    const nombreCompletoRegex = new RegExp(
                      `${nombreInput}\\s*${apellidoMaternoInput}\\s*${apellidoPaternoInput}`
                    );

                    if (!nombreCompletoRegex.test(nombre_defensor_select.defensor.nombre_defensor)) {
                      const modal = document.querySelector('modal-warning');
                      modal.message = 'El nombre del defensor seleccionado no coincide con el nombre ingresado.';
                      modal.title = 'Error de validación';
                      modal.open = true;
                    } else {

                      const usuario = {
                        nombre: nombreInput,
                        paterno: apellidoPaternoInput,
                        materno: apellidoMaternoInput,
                        correo: correoInput,
                        password: passwordInput,
                        id_distrito_judicial: this.#distrito2.value,
                        id_empleado: JSON.parse(this.#defensor.value).id_defensor,
                        estatus_general: estatusUsuarioInput.toUpperCase(),
                        id_tipouser: 3
                      };
                      const response = await this.#api.postUsuario(usuario);
                      if (response) {
                        this.#nombre.value = '';
                        this.#apellidoPaterno.value = '';
                        this.#apellidoMaterno.value = '';
                        this.#correo.value = '';
                        this.#password.value = '';
                        this.#estatusUsuario.value = '0';
                        this.mostrarUsuarios();
                        this.resetRadioAndSelect();

                      }
                    }
                  }
                }
              }
            } else if (this.#distritoRadio.checked) {
              if (this.#distrito.value === '0') {
                const modal = document.querySelector('modal-warning')
                modal.message = 'Debe seleccionar un distrito judicial para poder agregar un usuario.'
                modal.title = 'Error de validación'
                modal.open = true
                this.resetRadioAndSelect();
              } else {
                const usuario = {
                  nombre: nombreInput,
                  paterno: apellidoPaternoInput,
                  materno: apellidoMaternoInput,
                  correo: correoInput,
                  password: passwordInput,
                  id_distrito_judicial: this.#distrito.value,
                  estatus_general: estatusUsuarioInput.toUpperCase(),
                  id_tipouser: 1
                };
                const response = await this.#api.postUsuario(usuario);
                if (response) {
                  this.#nombre.value = '';
                  this.#apellidoPaterno.value = '';
                  this.#apellidoMaterno.value = '';
                  this.#correo.value = '';
                  this.#password.value = '';
                  this.#estatusUsuario.value = '0';
                  this.mostrarUsuarios();
                  this.resetRadioAndSelect();
                }
              }
            }
          }

        }

      } catch (error) {
        console.error('Error al agregar un nuevo usuario:', error);
      }
    } else {

      const modal = document.querySelector('modal-warning')
      modal.message = 'No se puede agregar un nuevo usuario si ya se ha seleccionado uno, se eliminaran los campos.'
      modal.title = 'Error de validación'
      modal.open = true
      this.#nombre.value = '';
      this.#apellidoPaterno.value = '';
      this.#apellidoMaterno.value = '';
      this.#correo.value = '';
      this.#password.value = '';
      this.#estatusUsuario.value = '0';
      this.#idSeleccion = null;
      this.mostrarUsuarios();
      this.resetRadioAndSelect(); 
      this.liberarRadioAndSelect();

    }
  }

  bloquearRadioAndSelect = () => {
    this.#empleadoRadio.disabled = true;
    this.#distritoRadio.disabled = true;
    this.#asesorRadio.disabled = true;
    this.#defensorRadio.disabled = true;
    this.#distrito.disabled = true;
    this.#asesor.disabled = true;
    this.#defensor.disabled = true;
    this.#distrito2.disabled = true;
  }
  liberarRadioAndSelect = () => {
    this.#empleadoRadio.disabled = false;
    this.#distritoRadio.disabled = false;
    this.#asesorRadio.disabled = false;
    this.#defensorRadio.disabled = false;
    this.#distrito.disabled = false;
    this.#asesor.disabled = false;
    this.#defensor.disabled = false;
    this.#distrito2.disabled = false;
  }

  resetRadioAndSelect = () => {
    this.#empleadoRadio.checked = false;
    this.#distritoRadio.checked = false;
    this.#asesorRadio.checked = false;
    this.#defensorRadio.checked = false;
    this.#distrito.value = '0';
    this.#asesor.value = '0';
    this.#defensor.value = '0';
    this.#distrito2.value = '0';

    this.#bloqueOpciones.classList.add('hidden');
    this.#bloqueDistrito.classList.add('hidden');
    this.#bloqueAsesor.classList.add('hidden');
    this.#bloqueDefensor.classList.add('hidden');

    this.#empleadoRadio.checked = true;
    this.#asesorRadio.checked = true;
    this.#bloqueOpciones.classList.remove('hidden');
    this.#bloqueAsesor.classList.remove('hidden');

  }


  editarUsuario = async () => {
    const usuarioID = this.#idSeleccion;
    if (usuarioID === null) {
      const modal = document.querySelector('modal-warning')
      modal.message = 'Debe seleccionar un usuario para poder editarlo.'
      modal.title = 'Error de validación'
      modal.open = true
    }
    else {
      //  console.log("Paso validaciones 1")
      const nombreInput = this.#nombre.value;
      const apellidoPaternoInput = this.#apellidoPaterno.value;
      const apellidoMaternoInput = this.#apellidoMaterno.value;
      const correoInput = this.#correo.value;
      const passwordInput = this.#password.value;
      const estatusUsuarioInput = this.#estatusUsuario.value;

      try {
        if (nombreInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de nombre es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (apellidoPaternoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de apellido paterno es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (apellidoMaternoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de apellido materno es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }

        if (correoInput === '') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de correo electrónico es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }



        if (estatusUsuarioInput === '0') {
          const modal = document.querySelector('modal-warning')
          modal.message = 'El campo de estatus de usuario es obligatorio.'
          modal.title = 'Error de validación'
          modal.open = true
        }
        //   console.log("Paso validaciones 2")

        if (nombreInput !== '' && apellidoPaternoInput !== '' && apellidoMaternoInput !== '' && correoInput !== '' && estatusUsuarioInput !== '0') {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          //    console.log("Paso validaciones 3")
          if (nombreInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de nombre no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          } else if (apellidoPaternoInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de apellido paterno no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true

          } else if (apellidoMaternoInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de apellido materno no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else if (correoInput.length > 45) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El campo de correo electrónico no puede contener más de 45 caracteres.'
            modal.title = 'Error de validación'
            modal.open = true
          }
          else if (!emailRegex.test(correoInput)) {
            const modal = document.querySelector('modal-warning')
            modal.message = 'El correo electrónico no es válido.'
            modal.title = 'Error de validación'
            modal.open = true

          }
          else {
            // console.log("Paso validaciones 4")
            if (this.#empleadoRadio.checked) {
              if (this.#asesorRadio.checked) {

                if (this.#asesor.value === '0') {
                  const modal = document.querySelector('modal-warning')
                  modal.message = 'Debe seleccionar un asesor para poder editar un usuario.'
                  modal.title = 'Error de validación'
                  modal.open = true
                }

                else {
                  //  console.log("Paso validaciones 5")
                  if (this.#distrito2.value === '0') {
                    const modal = document.querySelector('modal-warning')
                    modal.message = 'Debe seleccionar un distrito judicial para poder editar un usuario.'
                    modal.title = 'Error de validación'
                    modal.open = true
                  } else {
                    const usuario = {
                      id_usuario: usuarioID,
                      nombre: nombreInput,
                      paterno: apellidoPaternoInput,
                      materno: apellidoMaternoInput,
                      correo: correoInput,
                      id_distrito_judicial: parseInt(this.#distrito2.value),
                      id_empleado: JSON.parse(this.#asesor.value).id_asesor,
                      estatus_general: estatusUsuarioInput.toUpperCase(),
                      id_tipouser: 2
                    };
                    const nombre_asesor_select = await this.#api.getAsesorID(JSON.parse(this.#asesor.value).id_asesor);
                    // Construye la expresión regular para el nombre completo del asesor
                    const nombreCompletoRegex = new RegExp(
                      `${nombreInput}\\s*${apellidoMaternoInput}\\s*${apellidoPaternoInput}`
                    );

                    if (!nombreCompletoRegex.test(nombre_asesor_select.asesor.nombre_asesor)) {
                      const modal = document.querySelector('modal-warning');
                      modal.message = 'El nombre del asesor seleccionado no coincide con el nombre ingresado.';
                      modal.title = 'Error de validación';
                      modal.open = true;
                    } else {
                      //   console.log("Paso validaciones 6")
                      const usuario_pre = await this.#api.getUsuarioByID(usuarioID);
                      const usuario_objet_find = usuario_pre.usuario;
                
                    
                      if (usuario.nombre === usuario_objet_find.nombre && usuario.paterno === usuario_objet_find.paterno && usuario.materno === usuario_objet_find.materno && usuario.correo === usuario_objet_find.correo && usuario.id_distrito_judicial === usuario_objet_find.id_distrito_judicial && usuario.id_empleado === usuario_objet_find.id_empleado && usuario.estatus_general === usuario_objet_find.estatus_general && usuario.id_tipouser === usuario_objet_find.tipo_user.id_tipouser) {

                        const modal = document.querySelector('modal-warning')
                        modal.message = 'No se ha realizado ningún cambio en el usuario,. ya que los datos son iguales a los actuales, se eliminaran los campos.'
                        modal.title = 'Error de validación'
                        modal.open = true
                        this.#nombre.value = '';
                        this.#apellidoPaterno.value = '';
                        this.#apellidoMaterno.value = '';
                        this.#correo.value = '';
                        this.#password.value = '';
                        this.#estatusUsuario.value = '0';
                        this.liberarRadioAndSelect();
                        this.resetRadioAndSelect();

                      }
                      else {

                        //   console.log("Paso validaciones 7")
                        const response = await this.#api.putUsuario(this.#idSeleccion, usuario);
                        if (response) {
                          this.#nombre.value = '';
                          this.#apellidoPaterno.value = '';
                          this.#apellidoMaterno.value = '';
                          this.#correo.value = '';
                          this.#password.value = '';
                          this.#estatusUsuario.value = '0';
                          this.mostrarUsuarios();
                          this.liberarRadioAndSelect();
                          this.resetRadioAndSelect();
                        }
                      }
                    }

                  }

                }
              }
              else if (this.#defensorRadio.checked) {
                if (this.#defensor.value === '0') {
                  const modal = document.querySelector('modal-warning')
                  modal.message = 'Debe seleccionar un defensor para poder editar un usuario.'
                  modal.title = 'Error de validación'
                  modal.open = true
                } else {
                  if (this.#distrito2.value === '0') {
                    const modal = document.querySelector('modal-warning')
                    modal.message = 'Debe seleccionar un distrito judicial para poder editar un usuario.'
                    modal.title = 'Error de validación'
                    modal.open = true
                  } else {
                    const usuario = {
                      id_usuario: usuarioID,
                      nombre: nombreInput,
                      paterno: apellidoPaternoInput,
                      materno: apellidoMaternoInput,
                      correo: correoInput,
                      id_distrito_judicial: parseInt(this.#distrito2.value),
                      id_empleado: JSON.parse(this.#defensor.value).id_defensor,
                      estatus_general: estatusUsuarioInput.toUpperCase(),
                      id_tipouser: 3
                    };

                    const nombre_defensor_select = await this.#api.getDefensorID(JSON.parse(this.#defensor.value).id_defensor);


                    const nombreCompletoRegex = new RegExp(
                      `${nombreInput}\\s*${apellidoMaternoInput}\\s*${apellidoPaternoInput}`
                    );

                    if (!nombreCompletoRegex.test(nombre_defensor_select.defensor.nombre_defensor)) {
                      const modal = document.querySelector('modal-warning');
                      modal.message = 'El nombre del defensor seleccionado no coincide con el nombre ingresado.';
                      modal.title = 'Error de validación';
                      modal.open = true;
                    } else {
                      const usuario_pre = await this.#api.getUsuarioByID(usuarioID);
                      const usuario_objet_find = usuario_pre.usuario;
                   
                      if (usuario.nombre === usuario_objet_find.nombre && usuario.paterno === usuario_objet_find.paterno && usuario.materno === usuario_objet_find.materno && usuario.correo === usuario_objet_find.correo && usuario.id_distrito_judicial === usuario_objet_find.id_distrito_judicial && usuario.id_empleado === usuario_objet_find.id_empleado && usuario.estatus_general === usuario_objet_find.estatus_general && usuario.id_tipouser === usuario_objet_find.tipo_user.id_tipouser) {
                        const modal = document.querySelector('modal-warning')
                        modal.message = 'No se ha realizado ningún cambio en el usuario,. ya que los datos son iguales a los actuales, se eliminaran los campos.'
                        modal.title = 'Error de validación'
                        modal.open = true
                        this.#nombre.value = '';
                        this.#apellidoPaterno.value = '';
                        this.#apellidoMaterno.value = '';
                        this.#correo.value = '';
                        this.#password.value = '';
                        this.#estatusUsuario.value = '0';
                        this.liberarRadioAndSelect();
                        this.resetRadioAndSelect();
                      }
                      else {
                        const response = await this.#api.putUsuario(this.#idSeleccion, usuario);
                        if (response) {
                          this.#nombre.value = '';
                          this.#apellidoPaterno.value = '';
                          this.#apellidoMaterno.value = '';
                          this.#correo.value = '';
                          this.#password.value = '';
                          this.#estatusUsuario.value = '0';
                          this.mostrarUsuarios();
                          this.liberarRadioAndSelect();
                          this.resetRadioAndSelect();

                        }
                      }
                    }
                  }
                }
              }

            } else if (this.#distritoRadio.checked) {
              if (this.#distrito.value === '0') {
                const modal = document.querySelector('modal-warning')
                modal.message = 'Debe seleccionar un distrito judicial para poder editar un usuario.'
                modal.title = 'Error de validación'
                modal.open = true
                this.liberarRadioAndSelect();
                this.resetRadioAndSelect();
              } else {
                const usuario = {
                  id_usuario: usuarioID,
                  nombre: nombreInput,
                  paterno: apellidoPaternoInput,
                  materno: apellidoMaternoInput,
                  correo: correoInput,
                  id_distrito_judicial:  parseInt(this.#distrito.value),
                  estatus_general: estatusUsuarioInput.toUpperCase(),
                  id_tipouser: 1
                };
                const usuario_pre = await this.#api.getUsuarioByID(usuarioID);
                const usuario_objet_find = usuario_pre.usuario;

                if (usuario.nombre === usuario_objet_find.nombre && usuario.paterno === usuario_objet_find.paterno && usuario.materno === usuario_objet_find.materno && usuario.correo === usuario_objet_find.correo && usuario.id_distrito_judicial === usuario_objet_find.id_distrito_judicial && usuario.estatus_general === usuario_objet_find.estatus_general && usuario.id_tipouser === usuario_objet_find.tipo_user.id_tipouser) {
                  const modal = document.querySelector('modal-warning')
                  modal.message = 'No se ha realizado ningún cambio en el usuario,. ya que los datos son iguales a los actuales, se eliminaran los campos.'
                  modal.title = 'Error de validación'
                  modal.open = true
                  this.#nombre.value = '';
                  this.#apellidoPaterno.value = '';
                  this.#apellidoMaterno.value = '';
                  this.#correo.value = '';
                  this.#password.value = '';
                  this.#estatusUsuario.value = '0';
                  this.liberarRadioAndSelect();
                  this.resetRadioAndSelect();
                }
                else {
                  const response = await this.#api.putUsuario(this.#idSeleccion, usuario);
                  if (response) {
                    this.#nombre.value = '';
                    this.#apellidoPaterno.value = '';
                    this.#apellidoMaterno.value = '';
                    this.#correo.value = '';
                    this.#password.value = '';
                    this.#estatusUsuario.value = '0';
                    this.mostrarUsuarios();
                    this.liberarRadioAndSelect();
                    this.resetRadioAndSelect();
                  }
                }
              }
            }

          }

        }

      } catch (error) {
        console.error('Error al editar un usuario:', error);
      }
    }

  }

  mostrarUsuarios = async () => {

    try {

      const usuarios = await this.#api.getUsuarios();
      const tableBody = this.#usuarios;
      tableBody.innerHTML = '';
      const lista = usuarios.usuarios;
      const funcion =
        lista.forEach(usuario => {
          const row = document.createElement('tr');
          row.innerHTML = `
              <tr id="usuario-${usuario.id_usuario}">
              <td class="px-6 py-4 whitespace-nowrap">${usuario.id_usuario}</td>
              <td class="px-6 py-4 whitespace-nowrap">${usuario.nombre}</td>
              <td class="px-6 py-4 whitespace-nowrap">${usuario.paterno}</td>
              <td class="px-6 py-4 whitespace-nowrap">${usuario.materno}</td>
              <td class="px-6 py-4 whitespace-nowrap">${usuario.tipo_user.tipo_usuario}</td>
              <td class="px-6 py-4 whitespace-nowrap">${usuario.id_distrito_judicial}</td>
              <td class="px-6 py-4 whitespace-nowrap">${usuario.estatus_general}</td>
              <td class="px-6 py-4 whitespace-nowrap">
              <button href="#" class="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded seleccionar-usuario" onclick="llamarActivarBotonSeleccionar(this.value)" value="${usuario.id_usuario}">
              Seleccionar
            </button>
          
              </td>
          </tr>
              `;
          tableBody.appendChild(row);
        });
    } catch (error) {
      console.error('Error al obtener los usuarios:', error);
    }


  }

  activarBotonSeleccionar = async usuarioId => {

    try {
      const usuarioID = await this.#api.getUsuarioByID(usuarioId);

      if (usuarioID) {

        this.#idSeleccion = usuarioID.usuario.id_usuario;
        this.#nombre.value = usuarioID.usuario.nombre;
        this.#apellidoPaterno.value = usuarioID.usuario.paterno;
        this.#apellidoMaterno.value = usuarioID.usuario.materno;
        this.#correo.value = usuarioID.usuario.correo;
        this.#estatusUsuario.value = usuarioID.usuario.estatus_general;
        if (usuarioID.usuario.tipo_user.tipo_usuario === 'ASESOR') {
          this.#asesorRadio.checked = true;
          this.#empleadoRadio.checked = true;
          this.#distrito2.value = usuarioID.usuario.id_distrito_judicial;
          const options = this.#asesor.options;

          for (let i = 0; i < options.length; i++) {
            if (i !== 0) {
              const optionValue = JSON.parse(options[i].value);
              if (optionValue.id_asesor === usuarioID.usuario.id_empleado) {
                this.#asesor.selectedIndex = i;
                break;
              }
            }
          }
          this.#bloqueOpciones.classList.remove('hidden');
          this.#bloqueDistrito.classList.add('hidden');
          this.#bloqueAsesor.classList.remove('hidden');
          this.#bloqueDefensor.classList.add('hidden');

        } else if (usuarioID.usuario.tipo_user.tipo_usuario === 'DEFENSOR') {
          this.#defensorRadio.checked = true;
          this.#empleadoRadio.checked = true;
          this.#distrito2.value = usuarioID.usuario.id_distrito_judicial;
          const options = this.#defensor.options;
          for (let i = 0; i < options.length; i++) {
            if (i !== 0) {
              const optionValue = JSON.parse(options[i].value);
              if (optionValue.id_defensor === usuarioID.usuario.id_empleado) {
                this.#defensor.selectedIndex = i;
                break;
              }
            }
          }
          this.#bloqueOpciones.classList.remove('hidden');
          this.#bloqueDistrito.classList.add('hidden');
          this.#bloqueAsesor.classList.add('hidden');
          this.#bloqueDefensor.classList.remove('hidden');


        } else if (usuarioID.usuario.tipo_user.tipo_usuario === 'SUPERVISOR') {
          this.#distritoRadio.checked = true;
          this.#distrito.value = usuarioID.usuario.id_distrito_judicial;
          this.#bloqueOpciones.classList.add('hidden');
          this.#bloqueDistrito.classList.remove('hidden');
          this.#bloqueAsesor.classList.add('hidden');
          this.#bloqueDefensor.classList.add('hidden');

        }


        this.bloquearRadioAndSelect();

      } else {
        console.error('El usuario con el ID proporcionado no existe.');
      }
    } catch (error) {
      console.error('Error al obtener el usuario por ID:', error);
    }
  }




}

customElements.define('usuarios-tab', UsuariosTab);

