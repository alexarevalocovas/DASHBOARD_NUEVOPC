import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
import { SelectionModel } from '@angular/cdk/collections';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDatepickerModule, MatNativeDateModule } from '@angular/material';
// Clases
// tslint:disable-next-line:max-line-length
import { Alumno, Juego, Jornada, TablaJornadas, AlumnoJuegoDeCompeticionLiga, TablaAlumnoJuegoDeCompeticion,
         TablaEquipoJuegoDeCompeticion, TablaPuntosFormulaUno } from '../../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../../servicios/index';


// Imports para abrir diálogo y snackbar
import { MatDialog, MatSnackBar } from '@angular/material';
import { from } from 'rxjs';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-editar-jornadas-juego-formula-uno',
  templateUrl: './editar-jornadas-juego-formula-uno.component.html',
  styleUrls: ['./editar-jornadas-juego-formula-uno.component.scss']
})
export class EditarJornadasJuegoDeCompeticionFormulaUnoComponent implements OnInit {

  /* Estructura necesaria para determinar que filas son las que se han seleccionado */
  selection = new SelectionModel<any>(true, []);
    // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;
  numeroTotalJornadas: number;
  jornadasTabla: Jornada[];
  jornadas: Jornada[];
  dataSourceJornada: any;
  myForm: FormGroup;
  NuevaFechaFormGroup: FormGroup;
  IDJornada: number;
  // tslint:disable-next-line:ban-types
  isDisabledJornada: Boolean = true;
  botonTablaDesactivadoJornada = true;
  JornadaSeleccionadaId: number;
  seleccionadosJornada: boolean[];
  JornadasCompeticion: TablaJornadas[] = [];
  NuevaFecha: Date;

  displayedColumnsJornada: string[] = ['select', 'NumeroDeJornada', 'Fecha', 'CriterioGanador'];

  // Editar Juego de Puntos
  // No nos permite avanzar en el primer paso si no se ha seleccionado una opción
  // tslint:disable-next-line:ban-types
  isDisabled: Boolean = true;
  myForm1: FormGroup;
  selectionPuntos = new SelectionModel<any>(true, []);
  botonTablaDesactivado = true;
  seleccionados: boolean[];
  Puntuacion: number[];
  dataSource: any;
  TablaPuntuacion: TablaPuntosFormulaUno[];
  displayedColumnsTablaPuntuacion: string[] = ['select', 'Posicion', 'Puntos'];
  JuegoModificado: Juego;
  listaAlumnosClasificacion: TablaAlumnoJuegoDeCompeticion[] = [];
  listaEquiposClasificacion: TablaEquipoJuegoDeCompeticion[] = [];

  // rankingIndividualFormulaUno: TablaAlumnoJuegoDeCompeticion[] = [];
  // rankingEquiposFormulaUno: TablaEquipoJuegoDeCompeticion[] = [];

  constructor(    public sesion: SesionService,
                  public location: Location,
                  public calculos: CalculosService,
                  public peticionesAPI: PeticionesAPIService,
                  // tslint:disable-next-line:variable-name
                  private _formBuilder: FormBuilder) {}

  ngOnInit() {
    const datos = this.sesion.DameDatosJornadas();
    this.jornadas = datos.jornadas;
    this.JornadasCompeticion = datos.JornadasCompeticion;
    // console.log ('this.JornadasCompeticion[1].Fecha');
    // console.log (this.JornadasCompeticion[0].Fecha);
    // console.log (this.JornadasCompeticion[1].Fecha);
    // console.log (this.JornadasCompeticion[2].Fecha);
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego seleccionado ' + this.juegoSeleccionado.Modo);
    console.log('Jornadas: ');
    console.log (this.jornadas);
    // this.JornadasCompeticion = this.TablaJornadas();
    console.log('Jornadas Competicion: ');
    console.log (this.JornadasCompeticion);
    this.dataSourceJornada = new MatTableDataSource (this.JornadasCompeticion);

    this.myForm = this._formBuilder.group({
      CriterioGanador: ['', Validators.required],
      picker: ['', Validators.required],
    });

    // Editar Puntuación
    console.log('Variables necesarias para editar puntuación');
    this.TablaPuntuacion = this.sesion.DameTablaeditarPuntos();
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.Puntuacion = this.juegoSeleccionado.Puntos;
    console.log(this.juegoSeleccionado);
    this.myForm1 = this._formBuilder.group({
      NuevaPuntuacion: ['', Validators.required],
    });
    this.listaAlumnosClasificacion = this.sesion.DameTablaAlumnoJuegoDeCompeticion();
    console.log('tabla alumnos clasificación:');
    console.log(this.listaAlumnosClasificacion);
    this.listaEquiposClasificacion = this.sesion.DameTablaEquipoJuegoDeCompeticion();
    console.log('tabla equipos clasificación:');
    console.log(this.listaEquiposClasificacion);

  }

  /* Para averiguar si todas las filas están seleccionadas */
  IsAllSelectedJornada() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSourceJornada.data.length;
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

  MasterToggleJornada() {
    if (this.IsAllSelectedJornada()) {
      this.selection.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSourceJornada.data.forEach(row => this.selection.select(row));
    }
  }
  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  /* En este caso para que esté activo también debe haber seleccionado el tipo de punto a asignar */
  ActualizarBotonTablaJornada() {
    console.log('Estoy en ActualizarBotonTablaJornada()');
    let NuevoCriterio: string;
    NuevoCriterio = this.myForm.value.CriterioGanador;
    console.log(this.selection.selected.length);
    console.log(this.NuevaFecha);
    console.log(NuevoCriterio);
    if ((this.selection.selected.length === 0) || ( this.NuevaFecha === undefined) || ( NuevoCriterio === undefined)) {
      this.botonTablaDesactivadoJornada = true;
    } else {
      this.botonTablaDesactivadoJornada = false;
    }
  }

  onChangeEvent(e): void {

    console.log('Nueva fecha seleccionada :' + e.target.value);

    this.NuevaFecha = e.target.value;

    let NuevoCriterio: string;
    NuevoCriterio = this.myForm.value.CriterioGanador;
    console.log(this.selection.selected.length);
    console.log(this.NuevaFecha);
    console.log(NuevoCriterio);
    if ((this.selection.selected.length === 0) || ( this.NuevaFecha === undefined) || ( NuevoCriterio === undefined)) {
      this.botonTablaDesactivadoJornada = true;
    } else {
      this.botonTablaDesactivadoJornada = false;
    }
  }

  EditarJornada() {
    // Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
    // valor de i
    let NuevoCriterio: string;
    NuevoCriterio = this.myForm.value.CriterioGanador;
    console.log('Voy a asignar Fecha ' + this.NuevaFecha );
    console.log('Voy a asignar criterio ' + NuevoCriterio);
    for ( let i = 0; i < this.dataSourceJornada.data.length; i++) {
      console.log ('Vuelta para guardar, check jornada ' + i + 1);


      // Buscamos los alumnos que hemos seleccionado
      if (this.selection.isSelected(this.dataSourceJornada.data[i]))  {
        console.log('Voy a asignar 2 ' + this.NuevaFecha + NuevoCriterio);
        console.log(this.jornadas[i]);
        console.log(this.NuevaFecha, NuevoCriterio, this.jornadas[i].id);
        this.IDJornada = this.jornadas[i].id;
        this.jornadas[i] = new Jornada (this.NuevaFecha, NuevoCriterio);
        console.log('Nueva Jornada ' + this.IDJornada);
        console.log(this.jornadas[i]);
        this.peticionesAPI.ModificarJornadaFormulaUno (this.jornadas[i], this.IDJornada)
        .subscribe(JornadaCreada => {
          this.jornadas[i] = JornadaCreada;
        });
        console.log('Jornada Modificada');
        this.JornadasCompeticion[i].CriterioGanador = this.jornadas[i].CriterioGanador;
        this.JornadasCompeticion[i].Fecha = this.jornadas[i].Fecha;
        this.JornadasCompeticion[i].NumeroDeJornada = i + 1;
        console.log(this.JornadasCompeticion[i]);


      }
    }
    this.dataSourceJornada = new MatTableDataSource (this.JornadasCompeticion);
    this.selection.clear();
    this.botonTablaDesactivadoJornada = true;
  }





  // Editar Puntos
  // Para averiguar si todas las filas están seleccionadas */
  IsAllSelected() {
    const numSelected = this.selectionPuntos.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */
  MasterToggle() {
    if (this.IsAllSelected()) {
      this.selectionPuntos.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSource.data.forEach(row => this.selectionPuntos.select(row));
    }
  }

  /* Esta función decide si el boton debe estar activo (si hay al menos
  una fila seleccionada) o si debe estar desactivado (si no hay ninguna fila seleccionada) */
  /* En este caso para que esté activo también debe haber seleccionado el tipo de punto a asignar */
  ActualizarBotonTabla() {
    let NuevaPuntuacion: number;
    NuevaPuntuacion = this.myForm1.value.NuevaPuntuacion;
    if ((this.selectionPuntos.selected.length === 0) || ( NuevaPuntuacion === undefined)) {
      this.botonTablaDesactivado = true;
    } else {
      this.botonTablaDesactivado = false;
    }
  }

  AnadirPuntos() {
    // Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
    // valor de i
    const JuegoEmpezado: boolean = this.JuegoEmpezado();
    if (JuegoEmpezado === false) {
      let NuevaPuntuacion: number;
      NuevaPuntuacion = Number(this.myForm1.value.NuevaPuntuacion);
      console.log('Voy a asignar NuevaPuntuacion ' + NuevaPuntuacion);
      if (!isNaN(NuevaPuntuacion)) {
          for ( let i = 0; i < this.dataSource.data.length; i++) {
            // Buscamos los alumnos que hemos seleccionado
            if (this.selectionPuntos.isSelected(this.dataSource.data[i]))  {
              console.log('Voy a asignar tantos puntos ' + NuevaPuntuacion);
              console.log(this.Puntuacion[i]);
              console.log(NuevaPuntuacion);
              this.Puntuacion[i] = NuevaPuntuacion;
              console.log(this.Puntuacion);
              this.TablaPuntuacion[i].Puntuacion = NuevaPuntuacion;
              console.log(this.TablaPuntuacion[i]);
              }
            }
          } else {
            Swal.fire('Introduzca una puntuación válida', 'Le recordamos que debe ser un Número', 'error');
        }
      this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
      this.selectionPuntos.clear();
      this.botonTablaDesactivado = true;
      } else {
    Swal.fire('Esta competición ya ha empezado', 'No es posible modificar las puntuaciones', 'error');
  }
  }

  AnadirJugadorconPuntos() {
    // Tengo que hacer un recorrido diferente del dataSource porque necesito saber el
    // valor de i
    let i: number;
    let NumeroParticipantes: number;
    i = this.Puntuacion.length;
    console.log(i);
    console.log(this.Puntuacion);
    if (this.juegoSeleccionado.Modo === 'Individual') {
      NumeroParticipantes = this.listaAlumnosClasificacion.length;
    } else {
      NumeroParticipantes = this.listaEquiposClasificacion.length;
    }
    if (i < NumeroParticipantes) {
      this.TablaPuntuacion[i] = new TablaPuntosFormulaUno(i + 1, 1);
      this.Puntuacion[i] = this.TablaPuntuacion[i].Puntuacion;
      console.log(this.TablaPuntuacion[i]);
      this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    } else {
        Swal.fire('No es posible añadir otra fila', 'Ya puntuan todos los participantes', 'error');
    }
  }

  EliminarJugadorconPuntos() {
    let i: number;
    i = this.Puntuacion.length;
    console.log(i);
    console.log(this.Puntuacion);
    if (i > 1) {
      this.TablaPuntuacion = this.TablaPuntuacion.splice(0, i - 1);
      this.Puntuacion = this.Puntuacion.slice(0, i - 1);
      console.log(this.TablaPuntuacion);
      console.log(this.Puntuacion);
      this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    } else {
        Swal.fire('No es posible eliminar otra fila', 'Como mínimo debe puntuar un participante', 'error');
    }
  }

  goBackandguardar() {
    const JuegoEmpezado: boolean = this.JuegoEmpezado();
    if (JuegoEmpezado === false) {
      this.JuegoModificado = this.juegoSeleccionado;
      console.log(this.JuegoModificado);
      this.JuegoModificado.Puntos = this.Puntuacion;
      console.log( this.JuegoModificado.Puntos);
      this.JuegoModificado.NumeroParticipantesPuntuan = this.Puntuacion.length;
      console.log(this.JuegoModificado);
      this.peticionesAPI.ModificaJuegoDeCompeticionFormulaUno(this.JuegoModificado, this.JuegoModificado.id)
      .subscribe(JuegoModificado => {
        this.JuegoModificado = JuegoModificado;
        console.log('El JuegoModificado es: ');
        console.log(this.JuegoModificado);
      });
      Swal.fire('La nueva puntuación se ha guardado correctamente', '', 'success');
      this.location.back();
    } else {
      Swal.fire('Esta competición ya ha empezado', 'No es posible modificar las puntuaciones', 'error');
    }
    
  }

  JuegoEmpezado() {
    let SumatorioPuntos: number;
    SumatorioPuntos = 0;
    if (this.juegoSeleccionado.Modo === 'Individual') {
      console.log(this.listaAlumnosClasificacion);
      this.listaAlumnosClasificacion.forEach(alumno => {SumatorioPuntos = SumatorioPuntos + alumno.puntos;
      });
    } else {
      console.log(this.listaEquiposClasificacion);
      this.listaEquiposClasificacion.forEach(equipo => {SumatorioPuntos = SumatorioPuntos + equipo.puntos;
      });
    }
    console.log('SumatorioPuntos = ' + SumatorioPuntos);
    if (SumatorioPuntos === 0) {
      return false;
    } else {
      return true;
    }
  }

  goBack() {
    if (this.dataSource !== this.sesion.DameTablaeditarPuntos()) {

      Swal.fire({
        title: '¿Seguro que quieres salir?',
        text: 'Has hecho cambios que no has aceptado',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si, estoy seguro'
      }).then((result) => {
        if (result.value) {
          this.location.back();
        }
      });
    } else {
      this.location.back();
    }
  }

  

}
