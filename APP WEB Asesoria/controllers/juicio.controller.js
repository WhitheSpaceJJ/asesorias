import { ControllerUtils } from '../lib/controllerUtils';

class JuicioController {
 // #IdSeleccion
  constructor(model) {
   this.model = model;
   this.utils = new ControllerUtils(model.user);
  //document.addEventListener("DOMContentLoaded", this.handleDOMContentLoaded);
  }

  handleDOMContentLoaded = () => {
    this.utils.validatePermissions({});
  // this.agregarEventosBotones();
  //  this.mostrarTiposDeJuicio();
  }
/*
  agregarEventosBotones = () => {
    //Agregar boton

    const agregarTipoJuicioBtn = document.getElementById('agregar-tipo-juicio');
    console.log(agregarTipoJuicioBtn)
    agregarTipoJuicioBtn.addEventListener('click', this.agregarTipoJuicio);

    //Editar boton
    const editarTipoJuicioBtn = document.getElementById('editar-tipo-juicio');
    editarTipoJuicioBtn.addEventListener('click', this.editarTipoJuicio);
    
    //Seleccionar boton
    const seleccionarBotones = document.querySelectorAll('.seleccionar-tipo-juicio');
    seleccionarBotones.forEach(boton => {
        boton.addEventListener('click', () => {
            const tipoJuicioId = boton.dataset.id;
            console.log(tipoJuicioId);
            this.idSeleccionado = tipoJuicioId;
            this.activarBotonSeleccionar(tipoJuicioId);
        });
    });

    // Nueva función para llamar a activarBotonSeleccionar dentro del contexto de la instancia actual de JuicioController
    const llamarActivarBotonSeleccionar = (tipoJuicioId) => {
        this.activarBotonSeleccionar(tipoJuicioId);
    };

    // Agregar la función llamarActivarBotonSeleccionar al ámbito global para que se pueda llamar desde el atributo onclick de los botones "Seleccionar"
    window.llamarActivarBotonSeleccionar = llamarActivarBotonSeleccionar;
}


 

  agregarTipoJuicio = async () => {
    const tipoJuicioInput = document.getElementById('tipo-juicio').value;
    const estatusJuicioInput = document.getElementById('estatus-tipo-juicio').value;
    
    try {
        const nuevoTipoJuicio = {
            tipo_juicio: tipoJuicioInput,
            estatus_general: estatusJuicioInput
        };
        
        const response = await this.model.postTiposJuicio(nuevoTipoJuicio);
        
        if (response) {
            document.getElementById('tipo-juicio').value = '';
            document.getElementById('estatus-tipo-juicio').value = '0';
             this.IdSeleccion = null;
            // Refrescar la lista de tipos de juicio después de agregar uno nuevo
            this.mostrarTiposDeJuicio();
        }
    } catch (error) {
        console.error('Error al agregar un nuevo tipo de juicio:', error);
    }
  }

  editarTipoJuicio = async () => {
    const tipoJuicioID = this.IdSeleccion; // Usar el ID seleccionado
    console.log(this.IdSeleccion)
    const tipoJuicioInput = document.getElementById('tipo-juicio').value;
    const estatusJuicioInput = document.getElementById('estatus-tipo-juicio').value;

    console.log(tipoJuicioInput)
    console.log(estatusJuicioInput)
    try {
        const tipoDeJuicio = {
            id_tipo_juicio:tipoJuicioID,
            tipo_juicio: tipoJuicioInput,
            estatus_general: estatusJuicioInput
        };
        console.log(tipoDeJuicio)
        console.log(tipoJuicioID)
        const response = await this.model.putTiposJuicio(tipoJuicioID, tipoDeJuicio);
        
        if (response) { 
            document.getElementById('tipo-juicio').value = '';
            document.getElementById('estatus-tipo-juicio').value = '0';
             this.IdSeleccion = null;
            // Refrescar la lista de tipos de juicio después de editar uno
            this.mostrarTiposDeJuicio();
        }
    } catch (error) {
        console.error('Error al editar el tipo de juicio:', error);
    }
}

  mostrarTiposDeJuicio = async () => {
    try {
        
        const tiposJuicio = await this.model.getTiposJuicio();
        const tableBody = document.getElementById('table-tipo-juicio');
        // Limpiar el cuerpo de la tabla antes de agregar nuevas filas
        tableBody.innerHTML = '';
        // Recorrer los tipos de juicio y agregar cada uno como una fila en la tabla
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
      
        // Obtener el tipo de juicio por ID
        const tipoJuicioID = await this.model.getTiposJuicioByID(tipoJuicioId);
        // Verificar si se encontró el tipo de juicio
        if (tipoJuicioID) {
            // Rellenar los campos de entrada con los valores de la fila seleccionada
            this.IdSeleccion = tipoJuicioID.tipoDeJuicio.id_tipo_juicio;
            document.getElementById('tipo-juicio').value = tipoJuicioID.tipoDeJuicio.tipo_juicio;
            document.getElementById('estatus-tipo-juicio').value = tipoJuicioID.tipoDeJuicio.estatus_general;
        } else {
            console.error('El tipo de juicio con el ID proporcionado no existe.');
        }
    } catch (error) {
        console.error('Error al obtener el tipo de juicio por ID:', error);
    }
}

*/


}

export { JuicioController };
