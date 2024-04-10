import { ControllerUtils } from '../lib/controllerUtils'
import { DataAsesoria } from '../components/asesoria/data-asesoria'

class ConsultaController {
  #pagina = 1
  #numeroPaginas
  #busquedaExitosa = false
  #actualDistrito = ""
  #actualZona = ""
  #fechaInicioActual = ""
  #fechaFinalActual = ""
  #fechaRegistroActual = ""
  constructor(model) {
    //Establecer distritito con respecto al usuario
    this.model = model
    this.utils = new ControllerUtils(model.user)
    this.CheckEventListeners()
    this.ComboBoxEventListeners()
    this.buttonsEventListeners()
  }

  // DOMContentLoaded
  handleDOMContentLoaded = () => {
    // add permissions
    this.utils.validatePermissions({})
    this.getNumeroPaginas()
    this.handleConsultarAsesorias()
    this.agregarMunicipios()
    this.agregarDistritios()

    this.agregarZonas()
    this.agregarDistritios()
    const searchButton = document.getElementById('searchButton');
    searchButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.handleFiltros();
    });

    const deleteButton = document.getElementById('deleteButton');
    deleteButton.style.display = 'none';
    deleteButton.addEventListener('click', (event) => {
      event.preventDefault();
      this.deleteFiltros();
    });
    const excel = document.getElementById('filtros-excel');
    excel.style.display = 'none';
    const dropdownbuttonexcell = document.getElementById('dropdown-button-excell');
    dropdownbuttonexcell.addEventListener('click', (event) => {
      event.preventDefault();
      this.filtrosexcel();
    });

    const botonDescargar = document.getElementById('btnDescargarReporte');
    botonDescargar.addEventListener('click', (event) => {
      event.preventDefault();
      this.handleDescargarReporte();
    });

    window.handleConsultarAsesoriasById = this.handleConsultarAsesoriasById
  }

  CheckEventListeners = () => {
    const checkboxAsesor = document.getElementById('check-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const checkboxDefensor = document.getElementById('check-defensor')

    checkboxAsesor.addEventListener('change', this.handleCheckboxChange)
    checkboxMunicipio.addEventListener('change', this.handleCheckboxChange)
    checkboxZona.addEventListener('change', this.handleCheckboxChange)
    checkboxDefensor.addEventListener('change', this.handleCheckboxChange)


    const checkboxDistrito = document.getElementById('check-distrito')
    checkboxDistrito.addEventListener('change', this.handleCheckboxChange)

    const checkboxSeleccion = document.getElementById('chkSeleccion');

    checkboxSeleccion.addEventListener('change', this.handleCheckboxChange)

  }

  ComboBoxEventListeners = () => {
    const selectAsesor = document.getElementById('select-asesor')
    const selectMunicipio = document.getElementById('select-municipio')
    const selectZona = document.getElementById('select-zona')
    const selectDefensor = document.getElementById('select-defensor')
    const selectBusqueda = document.getElementById('select-fecha')

    selectBusqueda.addEventListener('change', this.handleSelectChange)
    selectAsesor.addEventListener('change', this.handleSelectChange)
    selectMunicipio.addEventListener('change', this.handleSelectChange)
    selectZona.addEventListener('change', this.handleSelectChange)
    selectDefensor.addEventListener('change', this.handleSelectChange)
    const selectDistrito = document.getElementById('select-distrito')
    selectDistrito.addEventListener('change', this.handleSelectChange)
  }

  buttonsEventListeners = () => {
    const prev = document.getElementById('anterior')
    const next = document.getElementById('siguiente')

    prev.addEventListener('click', this.handlePrevPage)
    next.addEventListener('click', this.handleNextPage)
  }


  handlePrevPage = async () => {
    //console.log(this.#pagina)
    // console.log(this.#numeroPaginas)
    if (this.#pagina > 1) {
      this.#pagina--
      this.handleConsultarAsesorias()
    }
  }

  handleNextPage = async () => {
    //console.log(this.#pagina)
    // console.log(this.#numeroPaginas)
    if (this.#pagina < this.#numeroPaginas) {
      this.#pagina++
      this.handleConsultarAsesorias()
    }
  }

  getNumeroPaginas = async () => {
    try{
    const numeroAsesorias = await this.model.getTotalAsesorias()
    const total = document.getElementById('total')
    total.innerHTML = ' :' + numeroAsesorias.totalAsesorias
    this.#numeroPaginas = (numeroAsesorias.totalAsesorias) / 10
    }catch(error){
      const modal = document.querySelector('modal-warning');
      modal.message = 'Error al obtener el total de asesorias, intente de nuevo mas tarde';
      modal.title = 'Error'
      modal.open = 'true'
    }
  }

  handleSelectChange = () => {
    const selectAsesor = document.getElementById('select-asesor')
    const selectZona = document.getElementById('select-zona')
    const selectDefensor = document.getElementById('select-defensor')

    const checkboxDefensor = document.getElementById('check-defensor')
    const checkboxAsesor = document.getElementById('check-asesor')
    const zona = selectZona.value
    const selectMunicipio = document.getElementById('select-municipio')
    const selectBusqueda = document.getElementById('select-fecha')
    if (selectBusqueda.value === '0') {
      const busqueda1 = document.getElementById('busqueda1')
      busqueda1.style.display = 'block'
      const busqueda2 = document.getElementById('busqueda2')
      busqueda2.style.display = 'none'
    } else {
      const busqueda1 = document.getElementById('busqueda1')
      busqueda1.style.display = 'none'
      const busqueda2 = document.getElementById('busqueda2')
      busqueda2.style.display = 'block'
    }




    const checkboxDistrito = document.getElementById('check-distrito')
    const selectDistrito = document.getElementById('select-distrito')
    const checkboxMunicipio = document.getElementById('check-municipio')

    if (checkboxDistrito.checked && selectDistrito.value !== '0' && checkboxMunicipio.checked
      && selectMunicipio.value === '0' && this.#actualDistrito === "") {
      this.#actualDistrito = selectDistrito.value
      const municipioActual = selectMunicipio.value
      this.agregarMunicipiosByDistrito().then(() => {
        let municipioEncontrado = false
        for (let i = 0; i < selectMunicipio.options.length; i++) {
          if (selectMunicipio.options[i].value === municipioActual) {
            municipioEncontrado = true
            break;
          }
        }
        if (municipioEncontrado) {
          selectMunicipio.value = municipioActual
        }

      })
    }
    else if (checkboxDistrito.checked && selectDistrito.value !== '0' && selectDistrito.value !== this.#actualDistrito) {
      this.#actualDistrito = selectDistrito.value
      const municipioActual = selectMunicipio.value
      this.agregarMunicipiosByDistrito().then(() => {
        let municipioEncontrado = false
        for (let i = 0; i < selectMunicipio.options.length; i++) {
          if (selectMunicipio.options[i].value === municipioActual) {
            municipioEncontrado = true
            break;
          }
        }
        if (municipioEncontrado) {
          selectMunicipio.value = municipioActual
        }

      })
    } else if (selectDistrito.value === '0' && (selectMunicipio.options.length < 15 && selectMunicipio.options.length > 1)) {
      this.#actualDistrito = ""
      const municipioActual = selectMunicipio.value
      this.agregarMunicipios().then(() => {

        selectMunicipio.value = municipioActual
      }
      )

    }

    const checkboxZona = document.getElementById('check-zona')


    if (zona !== '0' && this.#actualZona === "") {
      this.#actualZona = zona
      selectAsesor.title = ""
      selectDefensor.title = ""
      this.agregarDefensores()
      this.agregarAsesores()
      selectAsesor.disabled = false
      selectDefensor.disabled = false
      checkboxAsesor.disabled = false
      checkboxDefensor.disabled = false

    } else if (zona !== '0' && this.#actualZona !== zona) {
      this.#actualZona = zona
      this.agregarDefensores()
      this.agregarAsesores()
    } else if (zona === '0') {
      this.#actualZona = ""
      selectAsesor.title = "Seleccione una zona para poder seleccionar un asesor"
      selectDefensor.title = "  Seleccione una zona para poder seleccionar un defensor"
      selectAsesor.disabled = true
      selectAsesor.value = 0
      selectDefensor.disabled = true
      selectDefensor.value = 0

      checkboxDefensor.checked = false
      checkboxAsesor.checked = false
      checkboxAsesor.disabled = true
      checkboxDefensor.disabled = true
    }



    /*
    if (zona !== '0') {
      checkboxDefensor.disabled = false
      if (checkboxDefensor.checked) {
        selectDefensor.disabled = false
        if (selectDefensor.value === '0') {
          this.agregarAsesores()
        }
      } else {
        selectDefensor.disabled = true
        selectDefensor.value = 0
      }
      checkboxAsesor.disabled = false
      if (checkboxAsesor.checked) {
        selectAsesor.disabled = false
        if (selectAsesor.value === '0') {
          this.agregarAsesores()
        }
      } else {
        selectAsesor.disabled = true
        selectAsesor.value = 0
      }
    } else {
      checkboxDefensor.disabled = true
      selectDefensor.value = 0
      checkboxAsesor.disabled = true
      selectAsesor.value = 0
    }
    */


  }

  handleCheckboxChange = () => {

    const checkboxAsesor = document.getElementById('check-asesor')
    const selectAsesor = document.getElementById('select-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const selectMunicipio = document.getElementById('select-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const selectZona = document.getElementById('select-zona')
    const checkboxDefensor = document.getElementById('check-defensor')
    const selectDefensor = document.getElementById('select-defensor')
    const checkboxDistrito = document.getElementById('check-distrito')
    const selectDistrito = document.getElementById('select-distrito')
    const zona = selectZona.value

    if (checkboxMunicipio.checked) {
      selectMunicipio.disabled = false
    } else {
      selectMunicipio.disabled = true
      selectMunicipio.value = 0
    }

    if (checkboxZona.checked) {
      selectZona.disabled = false
    } else {
      selectZona.disabled = true
      selectZona.value = 0

    }


    if (checkboxDistrito.checked) {
      selectDistrito.disabled = false
      // selectDistrito.value = this.#actualDistrito
    } else {
      selectDistrito.disabled = true
      selectDistrito.value = 0



    }

    if (checkboxDistrito.checked && selectDistrito.value !== '0' && checkboxMunicipio.checked
      && selectMunicipio.value === '0' && this.#actualDistrito === "") {
      this.#actualDistrito = selectDistrito.value
      this.agregarMunicipiosByDistrito();
    }
    else if (checkboxDistrito.checked && selectDistrito.value !== '0' && selectDistrito.value !== this.#actualDistrito) {
      this.#actualDistrito = selectDistrito.value
      this.agregarMunicipiosByDistrito();


    } else if (selectDistrito.value === '0' && (selectMunicipio.options.length < 15 && selectMunicipio.options.length > 1)) {
      this.#actualDistrito = ""
      const municipioActual = selectMunicipio.value
      this.agregarMunicipios().then(() => {
        selectMunicipio.value = municipioActual
      }
      )


    }
    if (!checkboxZona.checked && (checkboxAsesor.checked || checkboxDefensor.checked) && selectZona.value === '0') {
      selectAsesor.disabled = true
      selectAsesor.value = 0
      selectDefensor.disabled = true
      selectDefensor.value = 0

      checkboxDefensor.checked = false
      checkboxAsesor.checked = false
      checkboxAsesor.disabled = true
      checkboxDefensor.disabled = true
    }
    if (zona !== '0' && this.#actualZona === "") {
      this.#actualZona = zona
      selectAsesor.title = ""
      selectDefensor.title = ""
      this.agregarDefensores()
      this.agregarAsesores()
      selectAsesor.disabled = false
      selectDefensor.disabled = false
      checkboxAsesor.disabled = false
      checkboxDefensor.disabled = false

    } else if (zona !== '0' && this.#actualZona !== zona) {
      this.#actualZona = zona
      this.agregarDefensores()
      this.agregarAsesores()
    } else if (zona === '0') {
      this.#actualZona = ""
      selectAsesor.title = "Seleccione una zona para poder seleccionar un asesor"
      selectDefensor.title = "  Seleccione una zona para poder seleccionar un defensor"
      selectAsesor.disabled = true
      selectAsesor.value = 0
      selectDefensor.disabled = true
      selectDefensor.value = 0

      checkboxDefensor.checked = false
      checkboxAsesor.checked = false
      checkboxAsesor.disabled = true
      checkboxDefensor.disabled = true
    }

    /*
    if (selectZona.value !== '0') {
    
      checkboxDefensor.disabled = false
      if (checkboxDefensor.checked) {
        selectDefensor.disabled = false
        if (selectDefensor.value === '0') {
          this.agregarDefensores()
        }
      } else {
        selectDefensor.disabled = true
        selectDefensor.value = 0
      }
      checkboxAsesor.disabled = false
      if (checkboxAsesor.checked) {
        selectAsesor.disabled = false
        if (selectAsesor.value === '0') {
          this.agregarAsesores()
        }
      } else {
        selectAsesor.disabled = true
        selectAsesor.value = 0
      }
    }
    */
    const checkboxSeleccion = document.getElementById('chkSeleccion');
    const checkboxNombreEmpleado = document.getElementById('chkNombreEmpleado');
    const checkboxNombreAsesorado = document.getElementById('chkNombreAsesorado');
    const checkboxGenero = document.getElementById('chkGenero');
    const checkboxEstadoCivil = document.getElementById('chkEstadoCivil');
    const checkboxNumeroHijos = document.getElementById('chkNumeroHijos');
    const checkboxTelefono = document.getElementById('chkTelefono');
    const checkboxColonia = document.getElementById('chkColonia');
    const checkboxTrabaja = document.getElementById('chkTrabaja');
    const checkboxIngresoMensual = document.getElementById('chkIngresoMensual');
    const checkboxMotivo = document.getElementById('chkMotivo');
    const checkboxResumen = document.getElementById('chkResumen');
    const checkboxTipoJuicio = document.getElementById('chkTipoJuicio');
    const checkboxConclusion = document.getElementById('chkConclusion');
    const checkboxDocumentosRecibidos = document.getElementById('chkDocumentosRecibidos');
    const checkboxFechaRegistro = document.getElementById('chkFechaRegistro');
    const checkboxNombreUsuario = document.getElementById('chkNombreUsuario');



    if (checkboxSeleccion.checked) {
      checkboxNombreEmpleado.disabled = true
      checkboxNombreAsesorado.disabled = true
      checkboxGenero.disabled = true
      checkboxEstadoCivil.disabled = true
      checkboxNumeroHijos.disabled = true
      checkboxTelefono.disabled = true
      checkboxColonia.disabled = true
      checkboxTrabaja.disabled = true
      checkboxIngresoMensual.disabled = true
      checkboxMotivo.disabled = true
      checkboxResumen.disabled = true
      checkboxTipoJuicio.disabled = true
      checkboxConclusion.disabled = true
      checkboxDocumentosRecibidos.disabled = true
      checkboxFechaRegistro.disabled = true
      checkboxNombreUsuario.disabled = true

      checkboxNombreEmpleado.checked = false
      checkboxNombreAsesorado.checked = false
      checkboxGenero.checked = false
      checkboxEstadoCivil.checked = false
      checkboxNumeroHijos.checked = false
      checkboxTelefono.checked = false
      checkboxColonia.checked = false
      checkboxTrabaja.checked = false
      checkboxIngresoMensual.checked = false
      checkboxMotivo.checked = false
      checkboxResumen.checked = false
      checkboxTipoJuicio.checked = false
      checkboxConclusion.checked = false
      checkboxDocumentosRecibidos.checked = false
      checkboxFechaRegistro.checked = false
      checkboxNombreUsuario.checked = false
    } else {
      checkboxNombreEmpleado.disabled = false
      checkboxNombreAsesorado.disabled = false
      checkboxGenero.disabled = false
      checkboxEstadoCivil.disabled = false
      checkboxNumeroHijos.disabled = false
      checkboxTelefono.disabled = false
      checkboxColonia.disabled = false
      checkboxTrabaja.disabled = false
      checkboxIngresoMensual.disabled = false
      checkboxMotivo.disabled = false
      checkboxResumen.disabled = false
      checkboxTipoJuicio.disabled = false
      checkboxConclusion.disabled = false
      checkboxDocumentosRecibidos.disabled = false
      checkboxFechaRegistro.disabled = false
      checkboxNombreUsuario.disabled = false

      checkboxNombreEmpleado.checked = true
      checkboxNombreAsesorado.checked = true
      checkboxGenero.checked = true
      checkboxEstadoCivil.checked = true
      checkboxNumeroHijos.checked = true
      checkboxTelefono.checked = true
      checkboxColonia.checked = true
      checkboxTrabaja.checked = true
      checkboxIngresoMensual.checked = true
      checkboxMotivo.checked = true
      checkboxResumen.checked = true
      checkboxTipoJuicio.checked = true
      checkboxConclusion.checked = true
      checkboxDocumentosRecibidos.checked = true
      checkboxFechaRegistro.checked = true
      checkboxNombreUsuario.checked = true
    }



  }


  filtrosexcel = () => {
    const excel = document.getElementById('filtros-excel');
    if (excel.style.display === 'block') {
      excel.style.display = 'none';
    } else {
      excel.style.display = 'block';
    }
  }
  limpiarFiltros = () => {
    this.activiarFiltros()


    const checkboxAsesor = document.getElementById('check-asesor')
    const selectAsesor = document.getElementById('select-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const selectMunicipio = document.getElementById('select-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const selectZona = document.getElementById('select-zona')
    const checkboxDefensor = document.getElementById('check-defensor')
    const selectDefensor = document.getElementById('select-defensor')
    const fechaInicio = document.getElementById('fecha-inicio')
    const fechaFinal = document.getElementById('fecha-final')
    const fecha_registro = document.getElementById('fecha-registro')
    const selectBusqueda = document.getElementById('select-fecha')
    const selectDistrito = document.getElementById('select-distrito')
    const checkboxDistrito = document.getElementById('check-distrito')
    checkboxDistrito.checked = false
    selectDistrito.value = 0
    selectBusqueda.value = 0
    fecha_registro.value = ''
    fechaInicio.value = ''
    fechaFinal.value = ''
    checkboxAsesor.checked = false;
    checkboxMunicipio.checked = false;
    checkboxZona.checked = false;
    checkboxDefensor.checked = false;
    selectMunicipio.value = 0;
    selectZona.value = 0;
    selectAsesor.disabled = true
    selectDefensor.disabled = true
    selectAsesor.value = 0;
    selectDefensor.value = 0;
    checkboxAsesor.disabled = true
    checkboxDefensor.disabled = true
    this.#busquedaExitosa = false
    this.#pagina = 1
    this.getNumeroPaginas()
    this.handleConsultarAsesorias()


    const checkboxSeleccion = document.getElementById('chkSeleccion');
    const checkboxNombreEmpleado = document.getElementById('chkNombreEmpleado');
    const checkboxNombreAsesorado = document.getElementById('chkNombreAsesorado');
    const checkboxGenero = document.getElementById('chkGenero');
    const checkboxEstadoCivil = document.getElementById('chkEstadoCivil');
    const checkboxNumeroHijos = document.getElementById('chkNumeroHijos');
    const checkboxTelefono = document.getElementById('chkTelefono');
    const checkboxColonia = document.getElementById('chkColonia');
    const checkboxTrabaja = document.getElementById('chkTrabaja');
    const checkboxIngresoMensual = document.getElementById('chkIngresoMensual');
    const checkboxMotivo = document.getElementById('chkMotivo');
    const checkboxResumen = document.getElementById('chkResumen');
    const checkboxTipoJuicio = document.getElementById('chkTipoJuicio');
    const checkboxConclusion = document.getElementById('chkConclusion');
    const checkboxDocumentosRecibidos = document.getElementById('chkDocumentosRecibidos');
    const checkboxFechaRegistro = document.getElementById('chkFechaRegistro');
    const checkboxNombreUsuario = document.getElementById('chkNombreUsuario');

    checkboxNombreEmpleado.disabled = true
    checkboxNombreAsesorado.disabled = true
    checkboxGenero.disabled = true
    checkboxEstadoCivil.disabled = true
    checkboxNumeroHijos.disabled = true
    checkboxTelefono.disabled = true
    checkboxColonia.disabled = true
    checkboxTrabaja.disabled = true
    checkboxIngresoMensual.disabled = true
    checkboxMotivo.disabled = true
    checkboxResumen.disabled = true
    checkboxTipoJuicio.disabled = true
    checkboxConclusion.disabled = true
    checkboxDocumentosRecibidos.disabled = true
    checkboxFechaRegistro.disabled = true
    checkboxNombreUsuario.disabled = true


    checkboxSeleccion.checked = true
    checkboxNombreEmpleado.checked = false
    checkboxNombreAsesorado.checked = false
    checkboxGenero.checked = false
    checkboxEstadoCivil.checked = false
    checkboxNumeroHijos.checked = false
    checkboxTelefono.checked = false
    checkboxColonia.checked = false
    checkboxTrabaja.checked = false
    checkboxIngresoMensual.checked = false
    checkboxMotivo.checked = false
    checkboxResumen.checked = false
    checkboxTipoJuicio.checked = false
    checkboxConclusion.checked = false
    checkboxDocumentosRecibidos.checked = false
    checkboxFechaRegistro.checked = false
    checkboxNombreUsuario.checked = false
    this.#fechaFinalActual = ""
    this.#fechaInicioActual = ""
    this.#fechaRegistroActual = ""
  }

  deleteFiltros = () => {
    const deleteButton = document.getElementById('deleteButton');
    deleteButton.style.display = 'none';
    const table = document.getElementById('table-body')
    table.innerHTML = ''
    this.limpiarFiltros()
    this.#pagina = 1
    this.#busquedaExitosa = false
    this.getNumeroPaginas()
    this.handleConsultarAsesorias()
  }

  borrarAsesor = () => {
    const selectAsesor2 = document.getElementById('select-asesor')
    selectAsesor2.innerHTML = ''
    const option3 = document.createElement('option')
    option3.value = 0
    option3.text = "Selecciona una opcion"
    selectAsesor2.appendChild(option3)
  }

  borrarDefensor = () => {
    const selectdefensor2 = document.getElementById('select-defensor')
    const option2 = document.createElement('option')
    selectdefensor2.innerHTML = ''
    option2.value = 0
    option2.text = "Selecciona una opcion"
    selectdefensor2.appendChild(option2)
  }

  borrarMunicipio = () => {
    const selectMunicipio2 = document.getElementById('select-municipio')
    selectMunicipio2.innerHTML = ''
    const option = document.createElement('option')
    option.value = 0
    option.text = "Selecciona una opcion"
    selectMunicipio2.appendChild(option)
  }


  handleDescargarReporte = async () => {
    try {
      //tecnicamente los siguientes check box quieres que avalues si estan en true y si estan en true 
      const checkboxNombreEmpleado = document.getElementById('chkNombreEmpleado');
      const checkboxNombreAsesorado = document.getElementById('chkNombreAsesorado');
      const checkboxGenero = document.getElementById('chkGenero');
      const checkboxEstadoCivil = document.getElementById('chkEstadoCivil');
      const checkboxNumeroHijos = document.getElementById('chkNumeroHijos');
      const checkboxTelefono = document.getElementById('chkTelefono');
      const checkboxColonia = document.getElementById('chkColonia');
      const checkboxTrabaja = document.getElementById('chkTrabaja');
      const checkboxIngresoMensual = document.getElementById('chkIngresoMensual');
      const checkboxMotivo = document.getElementById('chkMotivo');
      const checkboxResumen = document.getElementById('chkResumen');
      const checkboxTipoJuicio = document.getElementById('chkTipoJuicio');
      const checkboxConclusion = document.getElementById('chkConclusion');
      const checkboxDocumentosRecibidos = document.getElementById('chkDocumentosRecibidos');
      const checkboxFechaRegistro = document.getElementById('chkFechaRegistro');
      const checkboxNombreUsuario = document.getElementById('chkNombreUsuario');
      const checkboxSeleccion = document.getElementById('chkSeleccion');

      let camposFiltros = [];
      if (checkboxNombreEmpleado.checked) {
        camposFiltros.push('nombre-empleado')
      }
      if (checkboxNombreAsesorado.checked) {
        camposFiltros.push('nombre-asesorado')
      }
      if (checkboxGenero.checked) {
        camposFiltros.push('genero')
      }
      if (checkboxEstadoCivil.checked) {
        camposFiltros.push('estado_civil')
      }
      if (checkboxNumeroHijos.checked) {
        camposFiltros.push('numero_hijos')
      }
      if (checkboxTelefono.checked) {
        camposFiltros.push('telefono')
      }
      if (checkboxColonia.checked) {
        camposFiltros.push('colonia')
      }
      if (checkboxTrabaja.checked) {
        camposFiltros.push('trabaja')
      }
      if (checkboxIngresoMensual.checked) {
        camposFiltros.push('ingreso_mensual')
      }
      if (checkboxMotivo.checked) {
        camposFiltros.push('motivo')
      }
      if (checkboxResumen.checked) {
        camposFiltros.push('resumen')
      }
      if (checkboxTipoJuicio.checked) {
        camposFiltros.push('tipo_juicio')
      }
      if (checkboxConclusion.checked) {
        camposFiltros.push('conclusion')
      }
      if (checkboxDocumentosRecibidos.checked) {
        camposFiltros.push('documentos-recibidos')
      }
      if (checkboxFechaRegistro.checked) {
        camposFiltros.push('fecha_registro')
      }
      if (checkboxNombreUsuario.checked) {
        camposFiltros.push('nombre-usuario')
      }


      if (this.#busquedaExitosa === false) {
        try {
          if (checkboxSeleccion.checked) {
            await this.model.getAsesoriasDescaga(null, null)
          } else {
            await this.model.getAsesoriasDescaga(null, camposFiltros)
          }

          const modal = document.querySelector('modal-warning');
          modal.message = 'La descarga del reporte ha sido exitosa';
          modal.open = 'true'
        }
        catch (error) {
          const modal = document.querySelector('modal-warning');
          modal.message = 'La descarga del reporte no ha sido exitosa,error en el servidor o no existen elementos.';
          modal.open = 'true'
          //   console.log(error)
        }

      } else {
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.style.display = 'block';



        const checkboxAsesor = document.getElementById('check-asesor')
        const checkboxMunicipio = document.getElementById('check-municipio')
        const checkboxZona = document.getElementById('check-zona')
        const checkboxDefensor = document.getElementById('check-defensor')

        const selectAsesor = document.getElementById('select-asesor')
        const selectMunicipio = document.getElementById('select-municipio')
        const selectZona = document.getElementById('select-zona')
        const selectDefensor = document.getElementById('select-defensor')

        const fechaInicio = document.getElementById('fecha-inicio')
        const fechaFinal = document.getElementById('fecha-final')
        const selectBusqueqda = document.getElementById('select-fecha')
        const selectDistrito = document.getElementById('select-distrito')
        const fechaRegistro = document.getElementById('fecha-registro')
        if (selectBusqueqda.value === '0') {
          if (fechaInicio.value === '' || fechaFinal.value === '') {
            const modal = document.querySelector('modal-warning');
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                this.#pagina = 1
                this.getNumeroPaginas()
                this.handleConsultarAsesorias()
              }
            });
            modal.message = 'Es requerido seleccionar una fecha de inicio y una fecha final para poder descargar el reporte';
            modal.open = 'true'

          }
          else if (fechaInicio.value > fechaFinal.value) {
            const modal = document.querySelector('modal-warning');
            modal.setOnCloseCallback(() => {
              if (modal.open === 'false') {
                this.#pagina = 1
                this.getNumeroPaginas()
                this.handleConsultarAsesorias()
              }
            });
            modal.message = 'La Fecha Inicial No Puede Ser Mayor A La Fecha Final';
            modal.open = 'true'
          } else {
            const filtros = {
              fecha_inicio: fechaInicio.value,
              fecha_final: fechaFinal.value,
              id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
              id_zona: selectZona.value !== '0' ? selectZona.value : null,
              id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
              id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
              id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
              fecha_registro: null
            }
            try {
              if (checkboxSeleccion.checked) {
                await this.model.getAsesoriasDescaga(filtros, null)
              } else {
                await this.model.getAsesoriasDescaga(filtros, camposFiltros)
              }

              const modal = document.querySelector('modal-warning');
              modal.message = 'La descarga del reporte ha sido exitosa';
              modal.open = 'true'
            }
            catch (error) {
              const modal = document.querySelector('modal-warning');
              modal.message = 'La descarga del reporte no ha sido exitosa, intente de nuevo mas tarde';
              modal.open = 'true'
              //   console.log(error)
            }
          }
        } else if (selectBusqueqda.value === '1') {
          const filtros = {
            fecha_inicio: null,
            fecha_final: null,
            id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
            id_zona: selectZona.value !== '0' ? selectZona.value : null,
            id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
            id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
            id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
            fecha_registro: fechaRegistro.value
          }
          try {
            if (checkboxSeleccion.checked) {
              await this.model.getAsesoriasDescaga(filtros, null)
            } else {
              await this.model.getAsesoriasDescaga(filtros, camposFiltros)
            }

            const modal = document.querySelector('modal-warning');
            modal.message = 'La descarga del reporte ha sido exitosa';
            modal.open = 'true'
          }
          catch (error) {
            const modal = document.querySelector('modal-warning');
            modal.message = 'La descarga del reporte no ha sido exitosa, intente de nuevo mas tarde';
            modal.open = 'true'
            //   console.log(error)
          }

        }


      }

    } catch (error) {
      console.error('Error:', error.message)
    }



  }

  handleConsultarAsesorias = async () => {
    try {
      //console.log(this.#pagina)
      // console.log(this.#numeroPaginas)
      // console.log(this.#busquedaExitosa)
      if (this.#busquedaExitosa === false) {
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.style.display = 'none';
        try{
        const asesoriasResponse = await this.model.getAsesorias(this.#pagina)
        const asesorias = asesoriasResponse.asesorias

        const table = document.getElementById('table-body')
        const rowsTable = document.getElementById('table-body').rows.length
        if (this.validateRows(rowsTable)) {
          asesorias.forEach(asesoria => {
            table.appendChild(this.crearRow(asesoria))
          })
        }
        }catch(error){ 
          const modal = document.querySelector('modal-warning');
          modal.message = 'Error al obtener las asesorias, intente de nuevo mas tarde';
          modal.title = 'Error'
          modal.open = 'true'

        }
      } else if (this.#busquedaExitosa === true) {
        const deleteButton = document.getElementById('deleteButton');
        deleteButton.style.display = 'block';
        // console.log("Busqueda Exitosa")


        const checkboxAsesor = document.getElementById('check-asesor')
        const checkboxMunicipio = document.getElementById('check-municipio')
        const checkboxZona = document.getElementById('check-zona')
        const checkboxDefensor = document.getElementById('check-defensor')

        const selectAsesor = document.getElementById('select-asesor')
        const selectMunicipio = document.getElementById('select-municipio')
        const selectZona = document.getElementById('select-zona')
        const selectDefensor = document.getElementById('select-defensor')

        const fechaInicio = document.getElementById('fecha-inicio')
        const fechaFinal = document.getElementById('fecha-final')
        const selectBusqueqda = document.getElementById('select-fecha')
        const selectDistrito = document.getElementById('select-distrito')
        const fechaRegistro = document.getElementById('fecha-registro')

        //    fechaInicio.value = this.#fechaInicioActual
        //   fechaFinal.value = this.#fechaFinalActual
        //   fechaRegistro.value = this.#fechaRegistroActual





        //  console.log("Busqueda Fecha V")
        //  console.log(selectBusqueqda.value)
        if (selectBusqueqda.value === '0') {
          // console.log("Busqueda por fechas")
          const filtros = {
            fecha_inicio: fechaInicio.value,
            fecha_final: fechaFinal.value,
            id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
            id_zona: selectZona.value !== '0' ? selectZona.value : null,
            id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
            id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
            id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
            fecha_registro: null
          }
          //   console.log(filtros)
          //  console.log(this.#pagina)
          const asesoriasResponse = await this.model.getAsesoriasByFiltersPaginacion(this.#pagina, filtros)
          //   console.log("PAgina ", this.#pagina)
          //   console.log(asesoriasResponse)
          const asesorias = asesoriasResponse
          const table = document.getElementById('table-body')
          const rowsTable = document.getElementById('table-body').rows.length
          if (this.validateRows(rowsTable)) {
            asesorias.forEach(asesoria => {
              table.appendChild(this.crearRow(asesoria))
            })
          }
        } else {
          // console.log("Busqueda por fecha")

          const filtros = {
            fecha_inicio: null,
            fecha_final: null,
            id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
            id_zona: selectZona.value !== '0' ? selectZona.value : null,
            id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
            id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
            id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
            fecha_registro: fechaRegistro.value
          }
          //    console.log(filtros)
          //  console.log(this.#pagina)
          const asesoriasResponse = await this.model.getAsesoriasByFiltersPaginacion(this.#pagina, filtros)
          //   console.log("Busqueda por fechas")
          console.log(asesoriasResponse)
          const asesorias = asesoriasResponse
          const table = document.getElementById('table-body')
          const rowsTable = document.getElementById('table-body').rows.length
          if (this.validateRows(rowsTable)) {
            asesorias.forEach(asesoria => {
              table.appendChild(this.crearRow(asesoria))
            })
          }

        }

      }

    } catch (error) {
      console.error('Error:', error.message)
    }
  }

  validateRows = rowsTable => {
    if (rowsTable > 0) {
      this.cleanTable(rowsTable);
      return true
    } else { return true }
  }

  cleanTable = rowsTable => {
    const table = document.getElementById('table-body')
    for (let i = rowsTable - 1; i >= 0; i--) {
      table.deleteRow(i)
    }
  }

  handleConsultarAsesoriasById = async id => {
    try {
      const button = document.querySelector('.consulta-button')
      button.disabled = true
      const asesoria = await this.model.getAsesoriaById(id)
      const persona = asesoria.asesoria.persona
      const domicilio = await this.model.getColoniaById(
        persona.domicilio.id_colonia
      )
      const modal = document.querySelector('modal-asesoria')
      const dataAsesoria = new DataAsesoria(asesoria, domicilio)

      const handleModalClose = () => {
        const modalContent = modal.shadowRoot.getElementById('modal-content')
        modalContent.innerHTML = ''
        button.disabled = false
      }

      modal.addEventListener('onClose', handleModalClose)

      const modalContent = modal.shadowRoot.getElementById('modal-content')
      modalContent.appendChild(dataAsesoria)

      modal.title = 'Datos Asesoría'
      modal.open = true
    } catch (error) {
      console.error('Error:', error.message)
    }
  }


  handleFiltros = async () => {

    const fechaInicio = document.getElementById('fecha-inicio')
    const fechaFinal = document.getElementById('fecha-final')
    const fechaRegistro = document.getElementById('fecha-registro')
    const selectBusqueda = document.getElementById('select-fecha')

    if (fechaInicio.disabled === true || fechaFinal.disabled === true || fechaRegistro.disabled === true) {
      const modal = document.querySelector('modal-warning');

      modal.message = 'Es requerido borrar los filtros para realizar una nueva busqueda';
      modal.open = 'true'
    }
    else {
      if (selectBusqueda.value === '0') {
        if (fechaInicio.value === '' || fechaFinal.value === '') {
          const modal = document.querySelector('modal-warning');

          modal.message = 'Es requerido seleccionar una fecha de inicio y una fecha final para poder descargar o consultar las asesorias';
          modal.open = 'true'

        } else if (fechaInicio.value > fechaFinal.value) {
          const modal = document.querySelector('modal-warning');

          modal.message = 'La Fecha Inicial No Puede Ser Mayor A La Fecha Final';
          modal.open = 'true'
        } else {
          const checkboxAsesor = document.getElementById('check-asesor')
          const checkboxMunicipio = document.getElementById('check-municipio')
          const checkboxZona = document.getElementById('check-zona')
          const checkboxDefensor = document.getElementById('check-defensor')

          const selectAsesor = document.getElementById('select-asesor')
          const selectMunicipio = document.getElementById('select-municipio')
          const selectZona = document.getElementById('select-zona')
          const selectDefensor = document.getElementById('select-defensor')

          const selectDistrito = document.getElementById('select-distrito')

          if (selectBusqueda.value === '0') {

            const filtros = {
              fecha_inicio: fechaInicio.value,
              fecha_final: fechaFinal.value,
              id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
              id_zona: selectZona.value !== '0' ? selectZona.value : null,
              id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
              id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
              id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
              fecha_registro: null
            }
            try {
              //     console.log(filtros)
              const asesoriasResponse = await this.model.getAsesoriasByFilters(filtros)
              const numeroAsesorias = await this.model.getTotalAsesoriasfiltro(filtros)
              //     console.log(numeroAsesorias)
              const total = document.getElementById('total')
              total.innerHTML = ' :' + numeroAsesorias.totalAsesoriasFiltro



              if (asesoriasResponse.length === 0) {
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'none';

                const modal = document.querySelector('modal-warning');

                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    this.#pagina = 1
                    this.getNumeroPaginas()
                    this.limpiarFiltros()
                    this.handleConsultarAsesorias()
                  }
                });

                modal.message = 'No Existen Coincidencias En La Búsqueda';
                modal.open = 'true'

              }
              else {
                this.bloquearFiltros()
                const deleteButton = document.getElementById('deleteButton')

                deleteButton.style.display = 'block';
                this.#busquedaExitosa = true
                this.#pagina = 1
                this.#numeroPaginas = (numeroAsesorias.totalAsesoriasFiltro) / 10
                this.handleConsultarAsesorias()
              }


            } catch (error) {
              console.error('Error:', error.message)
            }

          }
          else {
            const filtros = {
              fecha_inicio: null,
              fecha_final: null,
              id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
              id_zona: selectZona.value !== '0' ? selectZona.value : null,
              id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
              id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
              id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
              fecha_registro: fechaRegistro.value
            }
            try {
              //      console.log(filtros)
              const asesoriasResponse = await this.model.getAsesoriasByFilters(filtros)
              const numeroAsesorias = await this.model.getTotalAsesoriasfiltro(filtros)
              //    console.log(numeroAsesorias)
              const total = document.getElementById('total')
              total.innerHTML = ' :' + numeroAsesorias.totalAsesoriasFiltro



              if (asesoriasResponse.length === 0) {
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'none';

                const modal = document.querySelector('modal-warning');

                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    this.#pagina = 1
                    this.getNumeroPaginas()
                    this.limpiarFiltros()
                    this.handleConsultarAsesorias()
                  }
                });

                modal.message = 'No Existen Coincidencias En La Búsqueda';
                modal.open = 'true'

              }
              else {
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'block';
                this.#busquedaExitosa = true
                this.#pagina = 1
                this.#numeroPaginas = (numeroAsesorias.totalAsesoriasFiltro) / 10
                this.handleConsultarAsesorias()
                this.bloquearFiltros()
              }


            } catch (error) {
              console.error('Error:', error.message)
            }
          }
        }

      } else {
        if (fechaRegistro.value === '') {
          const modal = document.querySelector('modal-warning');
          modal.message = 'Es requerido seleccionar una fecha de registro para poder descargar o consultar las asesorias';
          modal.open = 'true'
        } else {
          const checkboxAsesor = document.getElementById('check-asesor')
          const checkboxMunicipio = document.getElementById('check-municipio')
          const checkboxZona = document.getElementById('check-zona')
          const checkboxDefensor = document.getElementById('check-defensor')

          const selectAsesor = document.getElementById('select-asesor')
          const selectMunicipio = document.getElementById('select-municipio')
          const selectZona = document.getElementById('select-zona')
          const selectDefensor = document.getElementById('select-defensor')

          const selectDistrito = document.getElementById('select-distrito')

          if (selectBusqueda.value === '0') {

            const filtros = {
              fecha_inicio: fechaInicio.value,
              fecha_final: fechaFinal.value,
              id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
              id_zona: selectZona.value !== '0' ? selectZona.value : null,
              id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
              id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
              id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
              fecha_registro: null
            }
            try {
              //   console.log(filtros)
              const asesoriasResponse = await this.model.getAsesoriasByFilters(filtros)
              const numeroAsesorias = await this.model.getTotalAsesoriasfiltro(filtros)
              //   console.log(numeroAsesorias)
              const total = document.getElementById('total')
              total.innerHTML = ' :' + numeroAsesorias.totalAsesoriasFiltro



              if (asesoriasResponse.length === 0) {
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'none';

                const modal = document.querySelector('modal-warning');

                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    this.#pagina = 1
                    this.getNumeroPaginas()
                    this.limpiarFiltros()
                    this.handleConsultarAsesorias()
                  }
                });

                modal.message = 'No Existen Coincidencias En La Búsqueda';
                modal.open = 'true'

              }
              else {
                this.bloquearFiltros()
                const deleteButton = document.getElementById('deleteButton')

                deleteButton.style.display = 'block';
                this.#busquedaExitosa = true
                this.#pagina = 1
                this.#numeroPaginas = (numeroAsesorias.totalAsesoriasFiltro) / 10
                this.handleConsultarAsesorias()
              }


            } catch (error) {
              console.error('Error:', error.message)
            }

          }
          else {
            const filtros = {
              fecha_inicio: null,
              fecha_final: null,
              id_municipio: checkboxMunicipio.checked ? selectMunicipio.value : null,
              id_zona: selectZona.value !== '0' ? selectZona.value : null,
              id_asesor: selectAsesor.value !== '0' ? selectAsesor.value : null,
              id_defensor: selectDefensor.value !== '0' ? selectDefensor.value : null,
              id_distrito: selectDistrito.value !== '0' ? selectDistrito.value : null,
              fecha_registro: fechaRegistro.value
            }
            try {
              //    console.log(filtros)
              const asesoriasResponse = await this.model.getAsesoriasByFilters(filtros)
              const numeroAsesorias = await this.model.getTotalAsesoriasfiltro(filtros)
              //    console.log(numeroAsesorias)
              const total = document.getElementById('total')
              total.innerHTML = ' :' + numeroAsesorias.totalAsesoriasFiltro



              if (asesoriasResponse.length === 0) {
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'none';

                const modal = document.querySelector('modal-warning');

                modal.setOnCloseCallback(() => {
                  if (modal.open === 'false') {
                    this.#pagina = 1
                    this.getNumeroPaginas()
                    this.limpiarFiltros()
                    this.handleConsultarAsesorias()
                  }
                });

                modal.message = 'No Existen Coincidencias En La Búsqueda';
                modal.open = 'true'

              }
              else {
                const deleteButton = document.getElementById('deleteButton');
                deleteButton.style.display = 'block';
                this.#busquedaExitosa = true
                this.#pagina = 1
                this.#numeroPaginas = (numeroAsesorias.totalAsesoriasFiltro) / 10
                this.handleConsultarAsesorias()
                this.bloquearFiltros()
              }


            } catch (error) {
              console.error('Error:', error.message)
            }
          }
        }
      }
    }
  }

  crearRow = asesoria => {
    const row = document.createElement('tr')
    row.classList.add('bg-white', 'border-b', 'hover:bg-gray-50')
    // console.log(asesoria.datos_asesoria)
    if (asesoria.datos_asesoria.estatus_asesoria === 'TURNADA') {
      console.log(asesoria)
    }
    row.innerHTML = `<td scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap ">
                ${asesoria.datos_asesoria.id_asesoria}
            </td>
            <td class="px-6 py-4">
                ${asesoria.persona.nombre} ${asesoria.persona.apellido_paterno} ${asesoria.persona.apellido_materno}
            </td>
            <td class="px-6 py-4">
                ${asesoria.tipos_juicio.tipo_juicio}
            </td>
            <td class="px-6 py-4">
                ${asesoria.datos_asesoria.resumen_asesoria}
            </td>
            <td class="px-6 py-4">
                ${asesoria.datos_asesoria.usuario}
            </td>
            <td class="px-6 py-4">
            ${asesoria.datos_asesoria.fecha_registro}
        </td>
        <td class="px-6 py-4">
        ${asesoria.defensor != null ? asesoria.defensor.nombre_defensor : asesoria.asesor.nombre_asesor}
    </td>
    <td class="px-6 py-4">
    ${asesoria.distrito_judicial.nombre_distrito_judicial}
</td>
<td class="px-6 py-4">
${asesoria.municipio.nombre_municipio}
</td>
<td class="px-6 py-4">
${asesoria.datos_asesoria.estatus_asesoria}
</td>
<td class="px-6 py-4">
${asesoria.datos_asesoria.estatus_asesoria === 'TURNADA' ? asesoria.turno.defensor.nombre_defensor : ''}
</td>
            <td class="px-6 py-4 text-right">
                <button href="#" class="consulta-button font-medium text-[#db2424] hover:underline" onclick="handleConsultarAsesoriasById(this.value)" value="${asesoria.datos_asesoria.id_asesoria}">Consultar</button>
            </td>`

    return row
  }

  bloquearFiltros = async () => {
    const fechaRegistro = document.getElementById('fecha-registro')
    const fechaInicio = document.getElementById('fecha-inicio')
    const fechaFinal = document.getElementById('fecha-final')

    fechaFinal.disabled = true
    fechaInicio.disabled = true
    fechaRegistro.disabled = true



    const select = document.getElementById('select-fecha')
    const selectZona = document.getElementById('select-zona')
    const selectDistrito = document.getElementById('select-distrito')
    const selectMunicipio = document.getElementById('select-municipio')
    const selectAsesor = document.getElementById('select-asesor')
    const selectDefensor = document.getElementById('select-defensor')

    selectZona.disabled = true
    selectDistrito.disabled = true
    selectMunicipio.disabled = true
    selectAsesor.disabled = true
    selectDefensor.disabled = true
    select.disabled = true




    const checkboxAsesor = document.getElementById('check-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const checkboxDefensor = document.getElementById('check-defensor')
    const checkboxDistrito = document.getElementById('check-distrito')
    const checkboxSeleccion = document.getElementById('chkSeleccion');

    checkboxAsesor.disabled = true
    checkboxMunicipio.disabled = true
    checkboxZona.disabled = true
    checkboxDefensor.disabled = true
    checkboxDistrito.disabled = true
  }

  activiarFiltros = async () => {
    const fechaRegistro = document.getElementById('fecha-registro')
    const fechaInicio = document.getElementById('fecha-inicio')
    const fechaFinal = document.getElementById('fecha-final')

    fechaFinal.disabled = false
    fechaInicio.disabled = false
    fechaRegistro.disabled = false

    const select = document.getElementById('select-fecha')
    const selectZona = document.getElementById('select-zona')
    const selectDistrito = document.getElementById('select-distrito')
    const selectMunicipio = document.getElementById('select-municipio')
    const selectAsesor = document.getElementById('select-asesor')
    const selectDefensor = document.getElementById('select-defensor')

    selectZona.disabled = false
    selectDistrito.disabled = false
    selectMunicipio.disabled = false
    selectAsesor.disabled = false
    selectDefensor.disabled = false
    select.disabled = false

    const checkboxAsesor = document.getElementById('check-asesor')
    const checkboxMunicipio = document.getElementById('check-municipio')
    const checkboxZona = document.getElementById('check-zona')
    const checkboxDefensor = document.getElementById('check-defensor')
    const checkboxDistrito = document.getElementById('check-distrito')
    const checkboxSeleccion = document.getElementById('chkSeleccion');

    checkboxAsesor.disabled = false
    checkboxMunicipio.disabled = false
    checkboxZona.disabled = false
    checkboxDefensor.disabled = false
    checkboxDistrito.disabled = false

  }

  agregarZonas = async () => {
    const select = document.getElementById('select-zona')
    const zonas = await this.model.getZonas()
    zonas.forEach(zona => {
      const option = document.createElement('option')
      option.value = zona.id_zona
      option.text = zona.nombre_zona
      select.appendChild(option)
    })
  }
  agregarDistritios = async () => {
    const select = document.getElementById('select-distrito')
    const distritos = await this.model.getDistritos()
    distritos.forEach(distrito => {
      const option = document.createElement('option')
      option.value = distrito.id_distrito_judicial
      option.text = distrito.nombre_distrito_judicial
      select.appendChild(option)
    })
  }



  agregarMunicipios = async () => {
    const municipios = await this.model.getMunicipios()
    const select = document.getElementById('select-municipio')
    this.borrarMunicipio()
    municipios.forEach(municipio => {
      const option = document.createElement('option')
      option.value = municipio.id_municipio
      option.text = municipio.nombre_municipio
      select.appendChild(option)
    })
  }
  agregarMunicipiosByDistrito = async () => {
    const select = document.getElementById('select-municipio')
    const id_distrito = document.getElementById('select-distrito').value
    const municipios = await this.model.getMunicipiosByDistrito(id_distrito)
    this.borrarMunicipio()
    municipios.forEach(municipio => {
      const option = document.createElement('option')
      option.value = municipio.id_municipio_distrito
      option.text = municipio.nombre_municipio
      select.appendChild(option)
    })
  }


  agregarDefensores = async () => {
    try {
      const select = document.getElementById('select-defensor')
      const id_zona = document.getElementById('select-zona').value

      const defensores = await this.model.getDefensoresByZona(id_zona)

      if (defensores.length !== 0) {
        this.borrarDefensor()
      }

      defensores.forEach(defensor => {
        const option = document.createElement('option')
        option.value = defensor.id_defensor
        option.text = defensor.nombre_defensor
        select.appendChild(option)
      })
    } catch (error) {
      console.error(error.message)
    }
  }

  agregarAsesores = async () => {

    try {
      const select = document.getElementById('select-asesor')
      const id_zona = document.getElementById('select-zona').value
      const asesores = await this.model.getAsesoresByZona(id_zona)
      const option = document.createElement('option')

      if (asesores.length !== 0) {
        this.borrarAsesor()

      }

      asesores.forEach(asesor => {
        const option = document.createElement('option')
        option.value = asesor.id_asesor
        option.text = asesor.nombre_asesor
        select.appendChild(option)
      })
    } catch (error) {
      console.error(error.message)
    }
  }

}
export { ConsultaController }
