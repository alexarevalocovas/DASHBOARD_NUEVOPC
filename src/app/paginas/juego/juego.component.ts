import {Component, OnInit, ViewChild} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {SelectionModel} from '@angular/cdk/collections';
import {MatDialog, MatTabGroup} from '@angular/material';
import {Location} from '@angular/common';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';


// tslint:disable-next-line:max-line-length
import {  Nivel, Alumno, Equipo, Juego, JuegoDeCompeticion, Punto, TablaPuntosFormulaUno,

          AlumnoJuegoDePuntos, EquipoJuegoDePuntos, Grupo, AlumnoJuegoDeCompeticionLiga,
          EquipoJuegoDeCompeticionLiga, Jornada, AlumnoJuegoDeCompeticionFormulaUno,
          EquipoJuegoDeCompeticionFormulaUno,AlumnoJuegoDeCompeticionTorneo,
          EquipoJuegoDeCompeticionTorneo, Cuestionario, JuegoDeAvatar, FamiliaAvatares,
          AlumnoJuegoDeAvatar, AsignacionPuntosJuego, Coleccion, AlumnoJuegoDeColeccion,
          EquipoJuegoDeColeccion, Escenario, JuegoDeGeocaching, AlumnoJuegoDeGeocaching, PuntoGeolocalizable,
          JuegoDeVotacionUnoATodos, AlumnoJuegoDeVotacionUnoATodos,
          JuegoDeVotacionTodosAUno, AlumnoJuegoDeVotacionTodosAUno, CuestionarioSatisfaccion,
          JuegoDeCuestionarioSatisfaccion, AlumnoJuegoDeCuestionarioSatisfaccion, Rubrica } from '../../clases/index';


// Services
import { SesionService, CalculosService, PeticionesAPIService, ComServerService } from '../../servicios/index';

import {Observable, of} from 'rxjs';
import 'rxjs';

import { DialogoConfirmacionComponent } from '../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';

import { AsignaCuestionarioComponent } from './asigna-cuestionario/asigna-cuestionario.component';
import { JuegoDeCuestionario } from 'src/app/clases/JuegoDeCuestionario';
import { AlumnoJuegoDeCuestionario } from 'src/app/clases/AlumnoJuegoDeCuestionario';
import { Router } from '@angular/router';

import {AsignaEscenarioComponent} from './asigna-escenario/asigna-escenario.component';
import {AsignaPreguntasComponent} from './asigna-preguntas/asigna-preguntas.component';
import {JuegoDeEvaluacion} from '../../clases/JuegoDeEvaluacion';
import {log} from 'util';
import {EquipoJuegoEvaluado} from '../../clases/EquipoJuegoEvaluado';
import {AlumnoJuegoEvaluado} from '../../clases/AlumnoJuegoEvaluado';


export interface OpcionSeleccionada {
  nombre: string;
  id: string;
}

export interface ChipColor {
  nombre: string;
  color: ThemePalette;
}



@Component({
  selector: 'app-juego',
  templateUrl: './juego.component.html',
  styleUrls: ['./juego.component.scss']
})

export class JuegoComponent implements OnInit {



  ///////////////////////////////////// VARIABLE GENERALES PARA EL COMPONENTE ///////////////////////////////////

  profesorId: number;
  grupo: Grupo;
  alumnosGrupo: Alumno[];
  equiposGrupo: Equipo[];
  @ViewChild('stepper') stepper;
  @ViewChild('tabs') tabGroup: MatTabGroup;

  // tslint:disable-next-line:ban-types
  juegoCreado: Boolean = false;

  // Usaré esta variable para determinar si debo advertir al usuario de
  // que está abandonando el proceso de creación del juego
  creandoJuego = false;

  juego: any;
  juegoDeCuestionario: JuegoDeCuestionario;
  juegoDeCompeticion: JuegoDeCompeticion;
  juegoDeAvatar: JuegoDeAvatar;
  juegoDeGeocaching: JuegoDeGeocaching;

  // Informacion para todos los juegos
  myForm: FormGroup;
  nombreDelJuego: string;
  tipoDeJuegoSeleccionado: string;
  modoDeJuegoSeleccionado: string;
  tengoNombre = false;
  tengoTipo = false;
  tengoModo = false;
  seleccionTipoJuego: ChipColor[] = [
    {nombre: 'Juego De Puntos', color: 'primary'},
    {nombre: 'Juego De Colección', color: 'accent'},
    {nombre: 'Juego De Competición', color: 'warn'},
    {nombre: 'Juego De Avatar', color: 'primary'},
    {nombre: 'Juego De Cuestionario', color: 'accent'},
    {nombre: 'Juego De Geocaching', color: 'warn'},
    {nombre: 'Juego De Votación', color: 'primary'},
    {nombre: 'Juego De Cuestionario de Satisfacción', color: 'accent'},
    {nombre: 'Juego De Evaluación', color: 'accent'},
  ];
  seleccionModoJuego: ChipColor[] = [
    {nombre: 'Individual', color: 'primary'},
    {nombre: 'Equipos', color: 'accent'}
  ];


  // información para crear un juego de puntos
  puntosDelJuego: Punto[] = [];
  nivelesDelJuego: Nivel[] = [];
  logosNiveles: FormData[] = [];

  // información para crear un juego de colección
  coleccionSeleccionada: Coleccion;
  tengoColeccion = false;
  modoAsignacion;


  // información para crear un juego de cuestionario
  cuestionario: Cuestionario;
  tengoCuestionario = false;
  puntuacionCorrecta: number;
  puntuacionIncorrecta: number;
  modoPresentacion: string;
  tengoModoPresentacion = false;
  seleccionModoPresentacion: string[] = ['Mismo orden para todos',
  'Preguntas desordenadas',
  'Preguntas y respuestas desordenadas'];
  tiempoLimite: number;
  tipoDeJuegoDeCuestionarioSeleccionado: string;
  tengoTipoJuegoCuestionario = false;
  seleccionTipoDeJuegoDeCuestionario: ChipColor[] = [
    {nombre: 'Test clásico', color: 'primary'},
    {nombre: 'Kahoot', color: 'accent'},
  ];

  // información para crear juego de avatares
  familiasElegidas: number[];
  tengoFamilias = false;

  // Información para crear juego de evaluación
  seleccionTipoDeEvaluacion: ChipColor[] = [
    {nombre: '1 a N', color: 'primary'},
    {nombre: 'Todos con todos', color: 'warn'}
  ];
  tipoDeEvaluacionSeleccionado: string;
  tengoTipoDeEvaluacion = false;
  //
  seleccionRelacionesEvaluacion: ChipColor[] = [
    {nombre: 'A elegir', color: 'primary'},
    {nombre: 'Aleatorio', color: 'warn'}
  ];
  relacionesEvaluacionSeleccionado: string;
  tengoRelacionEvaluacion = false;
  relacionesMap = new Map();
  numeroDeMiembros = 1;
  //
  profesorEvalua = false;
  profesorEvaluaModo = 'normal';
  autoevaluacion = false;
  //
  tengoRubrica = false;
  rubricaElegida: Rubrica;
  rubricas: Rubrica[];
  //
  seleccionCriterioEvaluacion: ChipColor[] = [
    {nombre: 'Por pesos', color: 'primary'},
    {nombre: 'Por penalización', color: 'warn'}
  ];
  criterioEvaluacionSeleccionado: string;
  tengoCriterioEvaluacion = false;
  //
  pesosArray = [];
  pesosSuman100 = true;
  penalizacionArray = [];
  //
  seleccionEquiposEvaluacion: ChipColor[] = [
    {nombre: 'Individualmente', color: 'primary'},
    {nombre: 'Por Equipos', color: 'warn'}
  ];
  equiposEvaluacionSeleccionado: string;
  tengoEquipoEvaluacion = false;
  //
  relacionAlumnosEquipos = [];
  comprobacionDeN = false;
  todosTienenEvaluador = false;
  // Información para crear juego de competicion

  tipoDeCompeticionSeleccionado: string;
  seleccionTipoDeCompeticion: ChipColor[] = [
    {nombre: 'Liga', color: 'primary'},
    {nombre: 'Fórmula Uno', color: 'warn'},
    {nombre: 'Torneo', color: 'accent'}
  
  ];
  tipoDeTorneoSeleccionado: string;
  seleccionModeloTorneo: ChipColor[] = [
    {nombre: 'Clásico', color: 'primary'},
    {nombre: 'Doble Eliminación', color: 'warn'},
    {nombre: 'Suizo', color: 'accent'}
  ];
  ParticipantesTorneo: Alumno[];
  CuadroModificado= false;
  tengoTipoDeCompeticion = false;
  tengoTipoDeTorneo = false;
  numeroDeJornadas: number;
  tengoNumeroDeJornadas = false;
  jornadasLiga: Jornada[];
  jornadasFormulaUno: Jornada[];

  nuevaPuntuacion: number;
  tengoNuevaPuntuacion = false;
  Puntuacion: number[] = [];
  selection = new SelectionModel<any>(true, []);
  dataSource: any;
  TablaPuntuacion: TablaPuntosFormulaUno[];
  displayedColumnsTablaPuntuacion: string[] = ['select', 'Posicion', 'Puntos'];



  // Informacion para juego de geocatching

  escenario: Escenario;
  tengoEscenario = false;
  puntosgeolocalizablesEscenario: PuntoGeolocalizable[];
  numeroDePuntosGeolocalizables: number;

  idescenario: number;
  PreguntasBasicas: number[];
  PreguntasBonus: number[];
  tengoPreguntas = false;

  puntuacionCorrectaGeo: number;
  puntuacionIncorrectaGeo: number;
  puntuacionCorrectaGeoBonus: number;
  puntuacionIncorrectaGeoBonus: number;



  // información para crear juego de votación

  tipoDeVotacionSeleccionado: string;
  seleccionTipoDeVotacion: ChipColor[] = [
    {nombre: 'Uno A Todos', color: 'primary'},
    {nombre: 'Todos A Uno', color: 'warn'}
  ];

  modoDeRepartoSeleccionado: string;
  seleccionModoReparto: ChipColor[] = [
    {nombre: 'Reparto fijo según posición', color: 'primary'},
    {nombre: 'Reparto libre', color: 'warn'}
  ];
  tengoModoReparto = false;
  puntosARepartir = 0;

  tengoTipoDeVotacion = false;
  conceptos: string[];
  listaConceptos: any[] = [];
  dataSourceConceptos;
  nombreConcepto;
  pesoConcepto;
  pesos: number[];
  totalPesos: number;
  conceptosAsignados = false;
  displayedColumnsConceptos: string[] = ['nombreConcepto', 'pesoConcepto', ' '];


  // Información para el juego de cuestionario de satisfacción
  cuestionarioSatisfaccion: CuestionarioSatisfaccion;
  tengoCuestionarioSatisfaccion = false;
  descripcionCuestionarioSatisfaccion: string;


  final = false;

  // HACEMOS DOS LISTAS CON LOS JUEGOS ACTIVOS, INACTIVOS Y PREPARADOS
  // Lo logico seria que fuesen listas de tipo Juego, pero meteremos objetos
  // de varios tipos (por ejemplo, de tipo Juego y de tipo JuegoDeCuestionario)
  juegosActivos: any[];
  juegosInactivos: any[];
  juegosPreparados: any[];


  // tslint:disable-next-line:no-inferrable-types
  opcionSeleccionada: string = 'todosLosJuegos';


  // criterioComplemento1: string;

  //////////////////////////////////// PARÁMETROS PARA PÁGINA DE CREAR JUEGO //////////////////////////////////////


  constructor(
               public dialog: MatDialog,
               private calculos: CalculosService,
               private sesion: SesionService,
               private comService: ComServerService,
               private location: Location,
               private peticionesAPI: PeticionesAPIService,
               // tslint:disable-next-line:variable-name
               private _formBuilder: FormBuilder,
               private router: Router
               ) { }


  ngOnInit() {
    this.grupo = this.sesion.DameGrupo();
    console.log (' Grupo ' + this.grupo);
    this.alumnosGrupo = this.sesion.DameAlumnosGrupo();
    //this.ParticipantesTorneo = this.sesion.DameAlumnosGrupo();
    this.profesorId = this.sesion.DameProfesor().id;
    // La lista de equipos del grupo no esta en el servicio sesión. Asi que hay que
    // ir a buscarla
    this.peticionesAPI.DameEquiposDelGrupo(this.grupo.id)
    .subscribe(equipos => {
      if (equipos[0] !== undefined) {
        console.log('Hay equipos');
        this.equiposGrupo = equipos;
        console.log(this.equiposGrupo);
        for (const equipo of equipos) {
          this.peticionesAPI.DameAlumnosEquipo(equipo.id).subscribe((alumnos: Alumno[]) => {
            this.relacionAlumnosEquipos.push({equipoId: equipo.id, alumnos});
            console.log('relacion alumnos equipos', this.relacionAlumnosEquipos);
          });
        }
      } else {
        // mensaje al usuario
        console.log('Este grupo aun no tiene equipos');
        this.equiposGrupo = undefined;
      }
    });

    // Ahora traemos la lista de juegos
    // esta operacion es complicada. Por eso está en calculos
    this.calculos.DameListaJuegos(this.grupo.id)
    .subscribe ( listas => {
            console.log ('He recibido los juegos');
            console.log (listas);
            this.juegosActivos = listas.activos;
            // Si la lista aun esta vacia la dejo como indefinida para que me
            // salga el mensaje de que aun no hay juegos
            if (listas.activos[0] === undefined) {
              this.juegosActivos = undefined;
              console.log ('No hay inactivos');
            } else {
              this.juegosActivos = listas.activos;
              console.log ('hay activos');
            }
            if (listas.inactivos[0] === undefined) {
              this.juegosInactivos = undefined;
              console.log ('No hay inactivos');
            } else {
              this.juegosInactivos = listas.inactivos;
              console.log ('hay inactivos');
            }
            if (listas.preparados[0] === undefined) {
              this.juegosPreparados = undefined;
            } else {
              this.juegosPreparados = listas.preparados;
            }

    });
    // Peticion API Juego de Evaluacion
    this.peticionesAPI.DameRubricasProfesor(this.profesorId).subscribe(rubricas => {
      console.log('Tengo rubricas', rubricas);
      this.rubricas = rubricas;
    });
    // Fin Peticion API Juego de Evaluacion
    //
    // Es este formulario recogeremos la información que vaya introduciendo
    // el usuario segun el tipo de juego
    this.myForm = this._formBuilder.group({
      NombreDelJuego: ['', Validators.required],
      PuntuacionCorrecta: ['', Validators.required],
      PuntuacionIncorrecta: ['', Validators.required],
      NumeroDeJornadas: ['', Validators.required],
      criterioPrivilegioComplemento1: ['', Validators.required],
      criterioPrivilegioComplemento2: ['', Validators.required],
      criterioPrivilegioComplemento3: ['', Validators.required],
      criterioPrivilegioComplemento4: ['', Validators.required],
      criterioPrivilegioVoz: ['', Validators.required],
      criterioPrivilegioVerTodos: ['', Validators.required],
      NuevaPuntuacion: ['', Validators.required],
      PuntuacionCorrectaGeo: ['', Validators.required],
      PuntuacionIncorrectaGeo : ['', Validators.required],
      PuntuacionCorrectaGeoBonus: ['', Validators.required],
      PuntuacionIncorrectaGeoBonus: ['', Validators.required],
      NombreDelConcepto: ['', Validators.required],
      PesoDelConcepto: ['', Validators.required],
      TiempoLimite: ['', Validators.required]
    });

    this.TablaPuntuacion = [];
    this.TablaPuntuacion[0] = new TablaPuntosFormulaUno(1, 10);
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.Puntuacion[0] = 10;

    this.listaConceptos = [];
    this.totalPesos = 0;

  }

  //////////////////////////////////////// FUNCIONES PARA LISTAR JUEGOS ///////////////////////////////////////////////


  // Busca la lista de juego de puntos y la clasifica entre activo e inactivo, y activa la función ListaJuegosDeColeccion

  // Función que usaremos para clicar en un juego y entrar en él,
  // Enviamos juego a la sesión
  JuegoSeleccionado(juego: Juego) {
    console.log ('**************guardo juego en la sesion');
    console.log (juego);
    this.sesion.TomaJuego(juego);
    // if (juego.Tipo === 'Juego De Geocaching') {
    //   this.router.navigateByUrl ('juegoSeleccionadoPreparado');
    // }
  }


  ///////////////////////////////////////// FUNCIONES PARA CREAR JUEGO ///////////////////////////////////////////////

  // RECUPERA LOS EQUIPOS DEL GRUPO
  TraeEquiposDelGrupo() {
    this.peticionesAPI.DameEquiposDelGrupo(this.grupo.id)
    .subscribe(equipos => {
      if (equipos[0] !== undefined) {
        console.log('Hay equipos');
        this.equiposGrupo = equipos;
        console.log(this.equiposGrupo);
      } else {
        // mensaje al usuario
        console.log('Este grupo aun no tiene equipos');
      }

    });
  }

  GuardaNombreDelJuego() {
    this.nombreDelJuego = this.myForm.value.NombreDelJuego;
    console.log ('Entro en guardar nombre');
    console.log (this.nombreDelJuego);
    if ( this.nombreDelJuego === undefined) {
      this.tengoNombre = false;
    } else {
      this.tengoNombre = true;
      this.creandoJuego = true; // empiezo el proceso de creacion del juego
      console.log ('tengo nombre ' + this.nombreDelJuego);
    }
  }


  TipoDeJuegoSeleccionado(tipo: ChipColor) {
    this.tipoDeJuegoSeleccionado = tipo.nombre;
    console.log(' tengo tipo ' + this.tipoDeJuegoSeleccionado);
    this.tengoTipo = true;
    // if (this.tipoDeJuegoSeleccionado === 'Juego De Competición') {
    //     this.NumeroDeVueltas();
    // }
  }


  // Recoge el modo de juego seleccionado y lo mete en la variable (modoDeJuegoSeleccionado), la cual se usará después
  // para el POST del juego
  ModoDeJuegoSeleccionado(modo: ChipColor) {
    this.modoDeJuegoSeleccionado = modo.nombre;
    console.log(' tengo modo ' + this.modoDeJuegoSeleccionado);
    console.log(' tengo tipo ' + this.tipoDeJuegoSeleccionado);
    if ((this.tipoDeJuegoSeleccionado === 'Juego De Cuestionario') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'Aún no es posible el juego de cuestionario en equipo', 'warning');
    } else if ((this.tipoDeJuegoSeleccionado === 'Juego De Avatar') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'Aún no es posible el juego de avatares en equipo', 'warning');
    } else if ((this.tipoDeJuegoSeleccionado === 'Juego De Geocaching') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'Aún no es posible el juego de geocaching en equipo', 'warning');
    } else if ((this.tipoDeJuegoSeleccionado === 'Juego De Votación') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'Aún no es posible el juego de votación en equipo', 'warning');
    } else if ((this.tipoDeJuegoSeleccionado === 'Juego De Cuestionario de Satisfacción') && (this.modoDeJuegoSeleccionado === 'Equipos')) {
      Swal.fire('Alerta', 'No existe el juego de cuestionario de satisfacción en equipo', 'warning');
    } else {
      if (this.modoDeJuegoSeleccionado === 'Individual') {
        if (this.alumnosGrupo === undefined) {
          Swal.fire('Alerta', 'No hay ningún alumno en este grupo', 'warning');
          console.log('No Hay alumnos, no puedo crear el juego');
        } else {
          console.log('Hay alumnos, puedo crear');
          this.tengoModo = true;
        }

      } else {
        if (this.equiposGrupo === undefined) {
          Swal.fire('Alerta', 'No hay ningún equipo en este grupo', 'warning');
          console.log('No se puede crear juego pq no hay equipos');
        } else {
          this.tengoModo = true;
          console.log('Hay equipos, puedo crear');
        }
      }
    }
  }

  // FUNCIONES PARA LA CREACION DE JUEGO DE EVALUACION
  TipoDeEvaluacionSeleccionado(tipoEvaluacion: ChipColor) {
    this.tipoDeEvaluacionSeleccionado = tipoEvaluacion.nombre;
    if (this.tipoDeEvaluacionSeleccionado === 'Todos con todos') {
      this.numeroDeMiembros = this.DameMaxSlider();
      this.HacerRelaciones(true);
    }
    this.tengoTipoDeEvaluacion = true;
  }

  RelacionDeEvaluacionSeleccionado(relacionEvaluacion: ChipColor) {
    this.relacionesEvaluacionSeleccionado = relacionEvaluacion.nombre;
    if (relacionEvaluacion.nombre === 'Aleatorio') {
      this.HacerRelaciones(true);
    } else {
      this.HacerRelaciones(false);
    }
    this.tengoRelacionEvaluacion = true;
  }
  Shuffle(a) {
    let j, x, i;
    for (i = a.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      x = a[i];
      a[i] = a[j];
      a[j] = x;
    }
    return a;
  }
  HacerRelaciones(fill: boolean) {
    const evaluados = this.DameEvaluados().map(item => item.id);
    this.relacionesMap = new Map();
    do {
      for (let i = 0; i < evaluados.length; i++) {
        if (!fill) {
          this.relacionesMap.set(evaluados[i], []);
        } else {
          let evaluadores = [];
          if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Individualmente') {
            for (const equipo of this.relacionAlumnosEquipos) {
              if (equipo.equipoId === evaluados[i]) {
                evaluadores = this.DameEvaluadores()
                  .filter(({id: id1}) => !equipo.alumnos.some(({id: id2}) => id1 === id2))
                  .map(item => item.id);
              }
            }
          } else {
            evaluadores = this.DameEvaluadores().filter(item => item.id !== evaluados[i]).map(item => item.id);
          }
          evaluadores = this.Shuffle(evaluadores);
          if (this.modoDeJuegoSeleccionado === 'Equipos'
            && this.equiposEvaluacionSeleccionado === 'Individualmente'
            && this.tipoDeEvaluacionSeleccionado === 'Todos con todos') {
            evaluadores.length = this.alumnosGrupo.length;
          } else {
            evaluadores.length = this.numeroDeMiembros;
          }
          this.relacionesMap.set(evaluados[i], evaluadores.filter(item => !isNaN(item)));
        }
      }
    } while (this.ComprobarSiTodosTienenEvaluadores() === false && fill === true);
    console.log('Relaciones object', this.relacionesMap);
    console.log('Todos tienen evaluadores', this.todosTienenEvaluador);
  }
  RelacionChanged(id: number, value: string[]) {
    console.log('Relaciones changed', id, value);
    this.relacionesMap.set(id, value);
    console.log('Relaciones object', this.relacionesMap);
    this.ComprobarSiTodosTienenEvaluadores();
  }
  ComprobarSiTodosTienenEvaluadores() {
    let encontrado1 = false;
    let encontrado2 = false;
    if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Individualmente') {
      this.relacionesMap.forEach((value, key) => {
        if (value.length < this.numeroDeMiembros) {
          this.comprobacionDeN = false;
          encontrado2 = true;
        }
        value.forEach(item => {
          if (this.ContarEvaluadores(item) === 0) {
            this.todosTienenEvaluador = false;
            encontrado1 = true;
          }
        });
      });
    } else {
      this.relacionesMap.forEach((value, key) => {
        if (this.ContarEvaluadores(key) === 0) {
          this.todosTienenEvaluador = false;
          encontrado1 = true;
        }
        if (value.length < this.numeroDeMiembros) {
          this.comprobacionDeN = false;
          encontrado2 = true;
        }
      });
    }
    if (!encontrado1) {
      this.todosTienenEvaluador = true;
    }
    if (!encontrado2) {
      this.comprobacionDeN = true;
    }
    return this.todosTienenEvaluador;
  }
    ContarEvaluadores(idEvaluado: number): number {
    let suma = 0;
    this.relacionesMap.forEach((value, key) => {
      if (value.includes(idEvaluado)) {
        suma++;
      }
    });
    return suma;
  }
    CriterioDeEvaluacionSeleccionado(criterioEvaluacion: ChipColor) {
    this.criterioEvaluacionSeleccionado = criterioEvaluacion.nombre;
    this.tengoCriterioEvaluacion = true;
    if (this.criterioEvaluacionSeleccionado === 'Por pesos') {
      this.pesosArray = [];
      for (let i = 0; i < this.rubricaElegida.Criterios.length; i++) {
        this.pesosArray.push([]);
        this.pesosArray[i].push(this.PesoPorDefecto(this.rubricaElegida.Criterios.length));
        for (let j = 0; j < this.rubricaElegida.Criterios[i].Elementos.length; j++) {
          this.pesosArray[i].push(this.PesoPorDefecto(this.rubricaElegida.Criterios[i].Elementos.length));
        }
      }
      console.log('pesos array', this.pesosArray);
    } else {
      this.penalizacionArray = [];
      for (let i = 0; i < this.rubricaElegida.Criterios.length; i++) {
        this.penalizacionArray.push([]);
        if (this.rubricaElegida.Criterios[i].Elementos.length >= 1) {
          this.penalizacionArray[i].push({num: 1, p: 75});
        }
        if (this.rubricaElegida.Criterios[i].Elementos.length >= 2) {
          this.penalizacionArray[i].push({num: 2, p: 50});
        }
        if (this.rubricaElegida.Criterios[i].Elementos.length >= 3) {
          this.penalizacionArray[i].push({num: 3, p: 0});
        }
      }
      console.log('penalizacion array', this.penalizacionArray);
    }
  }
    EquipoDeEvaluacionSeleccionado(equipoEvaluacion: ChipColor) {
    this.equiposEvaluacionSeleccionado = equipoEvaluacion.nombre;
    this.tengoEquipoEvaluacion = true;
  }
    AutoevaluacionChange(isChecked: boolean) {
    this.autoevaluacion = isChecked;
  }
    ProfesorEvaluaChange(isChecked: boolean) {
    this.profesorEvalua = isChecked;
  }
    ProfesorEvaluaModoChange(value: string) {
    this.profesorEvaluaModo = value;
  }
    DameMaxSlider(): number {
    if (this.modoDeJuegoSeleccionado === 'Individual') {
      return this.alumnosGrupo.length - 1;
    } else if (this.modoDeJuegoSeleccionado === 'Equipos') {
      if (this.equiposEvaluacionSeleccionado === 'Por Equipos') {
        return this.equiposGrupo.length - 1;
      } else if (this.equiposEvaluacionSeleccionado === 'Individualmente') {
        let min = this.alumnosGrupo.length;
        for (let i = 0; i < this.relacionAlumnosEquipos.length; i++) {
          if (this.relacionAlumnosEquipos[i].alumnos.length < min) {
            min = this.relacionAlumnosEquipos[i].alumnos.length;
          }
        }
        return min;
      }
    }
  }

    DameEvaluados(): any {
    if (this.modoDeJuegoSeleccionado === 'Individual') {
      return this.alumnosGrupo;
    } else {
      return this.equiposGrupo;
    }
  }
    DameEvaluadores(): any {
    if (this.equiposEvaluacionSeleccionado === 'Por Equipos') {
      return this.equiposGrupo;
    } else {
      return this.alumnosGrupo;
    }
  }
  public DameRelacionesAlumnoEquipos() {
    return this.relacionAlumnosEquipos;
  }
  SliderChanged(value: number) {
    console.log('Slider changed to', value);
    this.numeroDeMiembros = value;
  }
  RubricaSeleccionChange(index: number) {
    console.log('Rubrica seleccionada', this.rubricas[index]);
    this.rubricaElegida = this.rubricas[index];
    this.tengoRubrica = true;
  }
  PesoPorDefecto(total: number): number {
    return parseFloat((100 / total).toFixed(2));
  }
  PesosChanged(name: string, value: string): void {
    console.log('Pesos changed', name, value);
    const criterio = name.split('-')[0];
    const elemento = name.split('-')[1];
    this.pesosArray[criterio][elemento] = parseFloat(value);
    console.log('pesos array changed', this.pesosArray);
    this.pesosSuman100 = this.PesosSuman100();
  }
  PesosParentChanged(name: string, value: string): void {
    console.log('Pesos parent changed', name, value);
    this.pesosArray[name][0] = parseFloat(value);
    console.log('pesos array changed', this.pesosArray);
    this.pesosSuman100 = this.PesosSuman100();
  }
  PesosSuman100(): boolean {
    let c = 0;
    for (let i = 0; i < this.pesosArray.length; i++) {
      let p = 0;
      for (let j = 0; j < this.pesosArray[i].length; j++) {
        if  (j === 0) {
          c += this.pesosArray[i][j];
        } else {
          p += this.pesosArray[i][j];
        }
      }
      if (Math.round((p + Number.EPSILON) * 10) / 10 !== 100) {
        return false;
      }
    }
    return Math.round((c + Number.EPSILON) * 10) / 10 === 100;
  }
  PenalizacionChanged(name: string, value: string): void {
    console.log('Penalizacion changed', name, value);
    const criterio = name.split('-')[0];
    const elemento = name.split('-')[1];
    const tipo = name.split('-')[2];
    if (tipo === 'num') {
      const tmp = this.penalizacionArray[criterio][elemento].p;
      this.penalizacionArray[criterio][elemento] = {num: parseInt(value, 10), p: tmp};
    } else if (tipo === 'p') {
      const tmp = this.penalizacionArray[criterio][elemento].num;
      this.penalizacionArray[criterio][elemento] = {num: tmp, p: parseInt(value, 10)};
    }
    console.log('penalizacion array', this.penalizacionArray);
  }
  CrearJuegoEvaluacion() {
    let evaluadores: number;
    if (this.tipoDeEvaluacionSeleccionado === 'Todos con todos') {
      evaluadores = 0;
    } else {
      evaluadores = this.numeroDeMiembros;
    }
    const juego: JuegoDeEvaluacion = new JuegoDeEvaluacion(
      null,
      this.nombreDelJuego,
      'Evaluacion',
      this.modoDeJuegoSeleccionado,
      true,
      false,
      this.profesorEvalua,
      this.profesorEvaluaModo === 'normal',
      this.autoevaluacion,
      evaluadores,
      this.pesosArray,
      this.criterioEvaluacionSeleccionado === 'Por pesos',
      this.penalizacionArray,
      this.rubricaElegida.id,
      this.profesorId,
      this.grupo.id
    );
    console.log('Creando Juego de Evaluacion', juego);
    this.peticionesAPI.CrearJuegoDeEvaluacion(juego).subscribe(res => {
      console.log('JuegoDeEvaluacionCreado', res);
      Swal.fire('Juego de Evaluación creado correctamente', ' ', 'success');
      this.juego = res;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      this.relacionesMap.forEach( (value: number[], key: number) => {
        if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Por Equipos') {
          const equipo: EquipoJuegoEvaluado = new EquipoJuegoEvaluado(
            null,
            res.id,
            key,
            value,
            null,
            null
          );
          this.peticionesAPI.CrearEquipoJuegoDeEvaluacion(equipo).subscribe(equipores => console.log('EquipoJuegoEvaluado', equipores));
        } else if (this.modoDeJuegoSeleccionado === 'Equipos' && this.equiposEvaluacionSeleccionado === 'Individualmente') {
          const equipo: EquipoJuegoEvaluado = new EquipoJuegoEvaluado(
            null,
            res.id,
            key,
            null,
            value,
            null
          );
          this.peticionesAPI.CrearEquipoJuegoDeEvaluacion(equipo).subscribe(equipores => console.log('EquipoJuegoEvaluado', equipores));
        } else if (this.modoDeJuegoSeleccionado === 'Individual') {
          const alumno: AlumnoJuegoEvaluado = new AlumnoJuegoEvaluado(
            null,
            res.id,
            key,
            value,
            null
          );
          this.peticionesAPI.CrearAlumnoJuegoDeEvaluacion(alumno).subscribe(alumnosres => console.log('AlumnoJuegoEvaluado', alumnosres));
        }
      });

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
        this.juegosActivos = [];
      }
      this.juegosActivos.push(this.juego);
      this.Limpiar();
      // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;
    });
  }

  // FUNCIONES PARA LA CREACION DE JUEGO DE PUNTOS
  RecibeTiposDePuntos($event) {
    this.puntosDelJuego = $event;
    console.log ('ya tengo los puntos');
    console.log (this.puntosDelJuego);
  }

  RecibeNivel($event) {
    this.nivelesDelJuego.push ($event.n);
    if ($event.l !== undefined) {
      this.logosNiveles.push ($event.l);
    }
    console.log ('ya tengo los niveles');
    console.log (this.nivelesDelJuego);
    console.log (this.logosNiveles);
  }


  // Función que usaremos para crear un juego de puntos.

  CrearJuegoDePuntos() {
    // primero creamos el juego
    this.peticionesAPI.CreaJuegoDePuntos(new Juego (this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado,
      undefined, undefined, undefined, undefined, undefined, undefined, undefined, undefined, this.nombreDelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      // Ahora asignamos los puntos
      // tslint:disable-next-line:max-line-length
      this.puntosDelJuego.forEach (punto =>
        this.peticionesAPI.AsignaPuntoJuego(new AsignacionPuntosJuego(punto.id, this.juego.id))
        .subscribe()
      );
      // asignamos los niveles
      if (this.nivelesDelJuego !== undefined) {
        this.nivelesDelJuego.forEach (nivel =>
          this.peticionesAPI.CreaNivel(nivel, this.juego.id)
          .subscribe()
        );
        // Guardamos los logos de los niveles
        this.logosNiveles.forEach (logo =>
          this.peticionesAPI.PonImagenNivel(logo)
          .subscribe()
        );
      }

      // Inscribo los participantes en el juego
      if (this.modoDeJuegoSeleccionado === 'Individual') {
        console.log('Voy a inscribir a los alumnos del grupo 1');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosGrupo.length; i++) {
          console.log(this.alumnosGrupo[i]);
          this.peticionesAPI.InscribeAlumnoJuegoDePuntos(new AlumnoJuegoDePuntos(this.alumnosGrupo[i].id, this.juego.id))
          .subscribe();
        }
      } else {
        console.log('Voy a inscribir los equipos del grupo');

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.equiposGrupo.length; i++) {
          console.log(this.equiposGrupo[i]);
          this.peticionesAPI.InscribeEquipoJuegoDePuntos(new EquipoJuegoDePuntos(this.equiposGrupo[i].id, this.juego.id))
          .subscribe();
        }
      }
      Swal.fire('Juego de puntos creado correctamente', ' ', 'success');

    // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
      // Si la lista aun no se ha creado no podre hacer el push
          this.juegosActivos = [];
      }
      this.juegosActivos.push (this.juego);
      this.Limpiar();
      // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;
    });
  }

  /// FUNCIONES PARA LA CREACION DE JUEGO DE COLECCIÓN

    // Recibo el nombre de la colección elegida en el componente hijo
  RecibeColeccion($event) {
    this.coleccionSeleccionada = $event;
    this.tengoColeccion = true;
  }

  CrearJuegoDeColeccion() {
    this.peticionesAPI.CreaJuegoDeColeccion(new Juego (this.tipoDeJuegoSeleccionado, this.modoDeJuegoSeleccionado, this.modoAsignacion,
      this.coleccionSeleccionada.id, undefined, undefined, undefined, undefined, undefined, undefined, this.nombreDelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      console.log(juegoCreado);
      console.log('Juego creado correctamente');
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      // Asignamos a los participantes en el juego
      if (this.modoDeJuegoSeleccionado === 'Individual') {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosGrupo.length; i++) {
          this.peticionesAPI.InscribeAlumnoJuegoDeColeccion(new AlumnoJuegoDeColeccion (this.alumnosGrupo[i].id, this.juego.id))
          .subscribe();
        }
      } else {
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.equiposGrupo.length; i++) {
          this.peticionesAPI.InscribeEquipoJuegoDeColeccion(new EquipoJuegoDeColeccion(this.equiposGrupo[i].id, this.juego.id))
          .subscribe();
        }
      }
      Swal.fire('Juego de colección creado correctamente', ' ', 'success');

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
            this.juegosActivos = [];
        }
      this.juegosActivos.push (this.juego);
      this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;
      // Notificación para los miembros del grupo
      // console.log ('envio notificación los miembros del grupo');
      // this.comService.EnviarNotificacionGrupo (
      //      this.grupo.id,
      //      'Nuevo juego de colección para el grupo ' + this.grupo.Nombre
      // );
      console.log ('envio notificación los miembros del grupo');
      this.comService.EnviarNotificacionGrupo (
          this.grupo.id,
          'Nuevo juego de colección para el grupo ' + this.grupo.Nombre
      );

    });
  }

  //// FUNCIONES PARA LA CREACION DE JUEGO DE CUESTIONARIO
  AbrirDialogoAgregarCuestionario(): void {
    const dialogRef = this.dialog.open(AsignaCuestionarioComponent, {
      width: '70%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Pasamos los parametros necesarios
      data: {
        profesorId: this.profesorId
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.cuestionario = this.sesion.DameCuestionario();
      this.tengoCuestionario = true;
      console.log('CUESTIONARIO SELECCIONADO --->' + this.cuestionario.Titulo);
    });
  }

  // Para habilitar el boton de guardar puntuaciones
  TengoPuntuaciones() {
    if (this.myForm.value.PuntuacionCorrecta === '' || this.myForm.value.PuntuacionIncorrecta === '') {
      return false;
    } else {
      return true;
    }
  }

  GuardarPuntuacion() {
    this.puntuacionCorrecta = this.myForm.value.PuntuacionCorrecta;
    this.puntuacionIncorrecta = this.myForm.value.PuntuacionIncorrecta;
  }
  GuardarModoPresentacion(modoPresentacion) {
    this.modoPresentacion = modoPresentacion;
    this.tengoModoPresentacion = true;
  }

  GuardarTiempoLimite() {
    this.tiempoLimite = this.myForm.value.TiempoLimite;
    if (this.tiempoLimite === undefined) {
      this.tiempoLimite = 0;
    }
  }

  TipoDeJuegoDeCuestionarioSeleccionado(tipoJuegoCuestionario: ChipColor) {
    this.tipoDeJuegoDeCuestionarioSeleccionado = tipoJuegoCuestionario.nombre;
    this.tengoTipoJuegoCuestionario = true;
  }

  CrearJuegoDeCuestionario() {

    // Tengo que crear un juego de tipo JuegoDeCuestionario y no uno de tipo Juego, como en los casos
    // anteriores. La razón es que no están bien organizado el tema de que los modelos de los diferentes juegos
    // tomen como base el modelo Juego genérico. De momento se queda así.


    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaJuegoDeCuestionario(new JuegoDeCuestionario (this.nombreDelJuego, this.tipoDeJuegoSeleccionado, this.tipoDeJuegoDeCuestionarioSeleccionado, this.puntuacionCorrecta,
      this.puntuacionIncorrecta, this.modoPresentacion,
      false, false, this.profesorId, this.grupo.id, this.cuestionario.id, this.tiempoLimite), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juegoDeCuestionario = juegoCreado;
      // Inscribimos a los alumnos (de momento no hay juego de cuestionario por equipos)
       // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnosGrupo.length; i++) {
        // tslint:disable-next-line:max-line-length
        this.peticionesAPI.InscribeAlumnoJuegoDeCuestionario(new AlumnoJuegoDeCuestionario(0, false, this.juegoDeCuestionario.id, this.alumnosGrupo[i].id ))
        .subscribe();
      }
      Swal.fire('Juego de cuestionario creado correctamente', ' ', 'success');

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosPreparados === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
            this.juegosPreparados = [];
        }
      this.juegosPreparados.push (this.juegoDeCuestionario);
      this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;

    });
  }

  //// FUNCIONES PARA LA CREACION DE UN JUEGO DE AVATARES
  RecibeFamiliasElegidas($event) {
    this.familiasElegidas = $event;
    this.tengoFamilias = true;
  }


  CrearJuegoDeAvatar( ) {

    const juego = new JuegoDeAvatar ( this.nombreDelJuego,
                                      this.tipoDeJuegoSeleccionado,
                                      this.modoDeJuegoSeleccionado,
                                      true);
    juego.Familias = this.familiasElegidas;
    juego.CriteriosPrivilegioComplemento1 = this.myForm.value.criterioPrivilegioComplemento1;
    juego.CriteriosPrivilegioComplemento2 = this.myForm.value.criterioPrivilegioComplemento2;
    juego.CriteriosPrivilegioComplemento3 = this.myForm.value.criterioPrivilegioComplemento3;
    juego.CriteriosPrivilegioComplemento4 = this.myForm.value.criterioPrivilegioComplemento4;
    juego.CriteriosPrivilegioVoz = this.myForm.value.criterioPrivilegioVoz;
    juego.CriteriosPrivilegioVerTodos = this.myForm.value.criterioPrivilegioVerTodos;
    this.peticionesAPI.CreaJuegoDeAvatar (juego, this.grupo.id)
      .subscribe (nuevoJuego => {
        this.juegoDeAvatar = nuevoJuego;
        // Ahora inscribimos en el juego a los participantes
        if (this.modoDeJuegoSeleccionado === 'Individual') {

          console.log('Voy a inscribir a los alumnos del grupo');
          // tslint:disable-next-line:max-line-length
          if (this.modoDeJuegoSeleccionado === 'Individual') {
              console.log('Voy a inscribir a los alumnos del grupo');
              // tslint:disable-next-line:prefer-for-of
              for (let i = 0; i < this.alumnosGrupo.length; i++) {
                // tslint:disable-next-line:max-line-length
                console.log ('inscribo');
                this.peticionesAPI.InscribeAlumnoJuegoDeAvatar(new AlumnoJuegoDeAvatar(this.alumnosGrupo[i].id,  this.juegoDeAvatar.id))
                .subscribe();
              }
          } else {
                  // Inscribo a los equipos
          }
          Swal.fire('Juego de avatares creado correctamente', ' ', 'success');

          // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
          if (this.juegosActivos === undefined) {
            // Si la lista aun no se ha creado no podre hacer el push
                this.juegosActivos = [];
            }
          this.juegosActivos.push (this.juegoDeAvatar);
          this.Limpiar();
            // Regresamos a la lista de equipos (mat-tab con índice 0)
          this.tabGroup.selectedIndex = 0;
      }});
  }

  // FUNCIONES PARA CREAR JUEGO DE COMPETICION
  TipoDeCompeticionSeleccionado(tipoCompeticion: ChipColor) {
    this.tipoDeCompeticionSeleccionado = tipoCompeticion.nombre;
    this.tengoTipoDeCompeticion = true;
  }
  TipoDeTorneoSeleccionado(tipoTorneo: ChipColor) {
    this.tipoDeTorneoSeleccionado = tipoTorneo.nombre;
    this.tengoTipoDeTorneo = true;
  }
  dropParticipantes(event: CdkDragDrop<any[]>) {
    moveItemInArray(this.ParticipantesTorneo, event.previousIndex, event.currentIndex);
    this.CuadroModificado = true;
  }

  GuardarNumeroDeJornadas() {
    this.numeroDeJornadas = this.myForm.value.NumeroDeJornadas;
    if (  this.numeroDeJornadas  === undefined || isNaN( this.numeroDeJornadas )) {
      this.tengoNumeroDeJornadas = false;
      Swal.fire('Introduzca un número de jornadas válido', 'Le recordamos que debe ser un número', 'error');
    } else {
      console.log ('tengo numero');
      this.tengoNumeroDeJornadas = true;
    }
  }

  GuardarNuevaPuntuacion() {
    this.nuevaPuntuacion = this.myForm.value.NuevaPuntuacion;
    console.log ('tengo nueva puntuacion ' + this.nuevaPuntuacion );
    this.tengoNuevaPuntuacion = true;

  }

  Preparado() {
    if ((this.tengoNuevaPuntuacion) &&  (this.selection.selected.length > 0)) {
      return true;
    } else {
      return false;
    }
  }

  AnadirPuntos() {
    console.log ('nueva puntuiacion');
    console.log (this.nuevaPuntuacion);
    if (!isNaN(this.nuevaPuntuacion)) {
      for ( let i = 0; i < this.dataSource.data.length; i++) {
        // Buscamos los alumnos que hemos seleccionado
        if (this.selection.isSelected(this.dataSource.data[i]))  {
          this.Puntuacion[i] = this.nuevaPuntuacion;
          this.TablaPuntuacion[i].Puntuacion = this.nuevaPuntuacion;
        }
      }
    } else {
         Swal.fire('Introduzca una puntuación válida', 'Le recordamos que debe ser un Número', 'error');
    }
    this.dataSource = new MatTableDataSource (this.TablaPuntuacion);
    this.selection.clear();
    this.tengoNuevaPuntuacion = false;
  }

  AnadirFila() {

    let i: number;
    let NumeroParticipantes: number;
    i = this.Puntuacion.length;
    console.log(i);
    console.log(this.Puntuacion);
    if (this.modoDeJuegoSeleccionado === 'Individual') {
      NumeroParticipantes = this.alumnosGrupo.length;
    } else {
      NumeroParticipantes = this.equiposGrupo.length;
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

  EliminarFila() {

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


  CrearJuegoDeCompeticionLiga() {

    // tslint:disable-next-line:max-line-lengtholean)
    this.peticionesAPI.CreaJuegoDeCompeticionLiga(new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeCompeticionSeleccionado,
                                                    this.modoDeJuegoSeleccionado, undefined, undefined, true, this.numeroDeJornadas, this.tipoDeCompeticionSeleccionado, undefined,
                                                    undefined, undefined, this.nombreDelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      // Creamos las jornadas
      console.log ('voy a crear jornadas');
      this.calculos.CrearJornadasLiga(this.numeroDeJornadas, this.juego.id)
      .subscribe ( jornadas => {
        this.jornadasLiga = jornadas;
        console.log('Jornadas creadas correctamente');
        console.log ( this.jornadasLiga );
        console.log ( this.jornadasLiga.length);

        if (this.modoDeJuegoSeleccionado === 'Individual') {
          // tslint:disable-next-line:max-line-length
          this.calculos.calcularLiga(this.alumnosGrupo.length, this.jornadasLiga.length, this.alumnosGrupo, this.grupo.id, this.jornadasLiga);
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionLiga(new AlumnoJuegoDeCompeticionLiga(this.alumnosGrupo[i].id, this.juego.id))
            .subscribe();
          }
        } else {

          // tslint:disable-next-line:max-line-length
          this.calculos.calcularLiga(this.equiposGrupo.length, this.jornadasLiga.length, this.equiposGrupo, this.grupo.id, this.jornadasLiga);

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.equiposGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeEquipoJuegoDeCompeticionLiga(new EquipoJuegoDeCompeticionLiga(this.equiposGrupo[i].id, this.juego.id))
            .subscribe();
          }
        }
        Swal.fire('Juego de competición tipo liga creado correctamente', ' ', 'success');
      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
            this.juegosActivos = [];
        }
        this.juegosActivos.push (this.juego);
        this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;
      });
    });
  }


  CrearJuegoDeCompeticionFormulaUno() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaJuegoDeCompeticionFormulaUno(new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeCompeticionSeleccionado,
                                                    this.modoDeJuegoSeleccionado, undefined, undefined, true, this.numeroDeJornadas, undefined, 
                                                    undefined, this.Puntuacion.length,
                                                    this.Puntuacion, this.nombreDelJuego), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      this.calculos.CrearJornadasFormulaUno(this.numeroDeJornadas, this.juego.id)
      .subscribe ( jornadas => {
        this.jornadasFormulaUno = jornadas;
        this.sesion.TomaDatosJornadasJuegoComponent( this.jornadasFormulaUno);

        // inscribo a los participantes
        if (this.modoDeJuegoSeleccionado === 'Individual') {

          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionFormulaUno(new AlumnoJuegoDeCompeticionFormulaUno(this.alumnosGrupo[i].id, this.juego.id))
            .subscribe();
          }
        } else {
          // tslint:disable-next-line:prefer-for-of
          for (let i = 0; i < this.equiposGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
            this.peticionesAPI.InscribeEquipoJuegoDeCompeticionFormulaUno(new EquipoJuegoDeCompeticionFormulaUno(this.equiposGrupo[i].id, this.juego.id))
            .subscribe();
          }
        }
        Swal.fire('Juego de competición tipo fórmula uno creado correctamente', ' ', 'success');

        // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
        if (this.juegosActivos === undefined) {
          // Si la lista aun no se ha creado no podre hacer el push
              this.juegosActivos = [];
          }
        this.juegosActivos.push (this.juego);
          // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
        this.Limpiar();
         // Regresamos a la lista de equipos (mat-tab con índice 0)
        this.tabGroup.selectedIndex = 0;

      });
    });
  }
  CrearCuadroTorneo(){
    /*/
    this.peticionesAPI.CreaJuegoDeCompeticionTorneo(new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeCompeticionSeleccionado,
                                                    this.modoDeJuegoSeleccionado, undefined, undefined, true, this.numeroDeJornadas, this.tipoDeCompeticionSeleccionado, undefined,
                                                    undefined, undefined, this.nombreDelJuego), this.grupo.id)
     .subscribe(juegoCreado => {
    this.juego = juegoCreado;
    this.sesion.TomaJuego(this.juego);
    this.juegoCreado = true;
    /*/
    console.log('Voy a calcular el cuadro del torneo');
    if (this.modoDeJuegoSeleccionado === 'Individual') {

        this.ParticipantesTorneo=this.calculos.calcularCuadro(this.alumnosGrupo);
    }
    else{
        this.ParticipantesTorneo=this.calculos.calcularCuadro(this.equiposGrupo);
    }
    console.log('CUADRO',this.ParticipantesTorneo);
  }
  
  CrearJuegoDeCompeticionTorneo() {

    // tslint:disable-next-line:max-line-lengtholean)
    console.log('voy a crear torneo');
    let nuevojuego = new Juego (this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeCompeticionSeleccionado,
    this.modoDeJuegoSeleccionado, undefined, undefined, true, 3,
    this.tipoDeCompeticionSeleccionado, this.tipoDeTorneoSeleccionado,
    undefined, undefined, this.nombreDelJuego, undefined , undefined, undefined, undefined, this.profesorId, undefined);
    console.log(nuevojuego);
    this.peticionesAPI.CreaJuegoDeCompeticionTorneo(nuevojuego, this.grupo.id)
    .subscribe(juegoCreado => {
      console.log('voy a crear torneo 2');
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;
      this.calculos.EnfrentamientosTorneo(this.ParticipantesTorneo)
      
     
      //Creamos el cuadro
    
        if (this.modoDeJuegoSeleccionado === 'Individual') {

          // tslint:disable-next-line:prefer-for-of
           for (let i = 0; i < this.alumnosGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
              this.peticionesAPI.InscribeAlumnoJuegoDeCompeticionTorneo(new AlumnoJuegoDeCompeticionTorneo(this.alumnosGrupo[i].id, this.juego.id))
              .subscribe();
            }
        } else {


          // tslint:disable-next-line:prefer-for-of
            for (let i = 0; i < this.equiposGrupo.length; i++) {
            // tslint:disable-next-line:max-line-length
              this.peticionesAPI.InscribeEquipoJuegoDeCompeticionTorneo(new EquipoJuegoDeCompeticionTorneo(this.equiposGrupo[i].id, this.juego.id))
              .subscribe();
            }
          }
          Swal.fire('Juego de competición tipo Torneo creado correctamente', ' ', 'success');
      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
          if (this.juegosActivos === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
              this.juegosActivos = [];
          }
          this.juegosActivos.push (this.juego);
          this.Limpiar();
        // Regresamos a la lista de equipos (mat-tab con índice 0)
          this.tabGroup.selectedIndex = 0;
        });
    
  }
  
  /// Funciones para crear juego de Geocatching
  // Geocaching
  AbrirDialogoAgregarEscenario(): void {
    const dialogRef = this.dialog.open(AsignaEscenarioComponent, {
      width: '70%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Pasamos los parametros necesarios
      data: {
        profesorId: this.profesorId
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.escenario = this.sesion.DameEscenario();

      console.log('ESCENARIO SELECCIONADO --->' + this.escenario.Mapa);
      this.DamePuntosGeolocalizablesDelEscenario(this.escenario);
      console.log(this.numeroDePuntosGeolocalizables);
      console.log(this.puntosgeolocalizablesEscenario);
    });
  }

  DamePuntosGeolocalizablesDelEscenario(escenario: Escenario) {

    console.log('voy a mostrar los puntosgeolocalizables del escenario ' + escenario.id);
    this.peticionesAPI.DamePuntosGeolocalizablesEscenario(escenario.id)
    .subscribe(res => {
      if (res[0] !== undefined) {
        this.puntosgeolocalizablesEscenario = res;
        console.log(res);
        this.numeroDePuntosGeolocalizables = this.puntosgeolocalizablesEscenario.length;
        console.log(this.numeroDePuntosGeolocalizables);
        this.tengoEscenario = true;
      } else {
        console.log('No hay puntosgeolocalizables en el escenario');
        this.puntosgeolocalizablesEscenario = undefined;
        this.numeroDePuntosGeolocalizables = 0;
      }
    });
  }

  AbrirDialogoAgregarPreguntas(): void {
    const dialogRef = this.dialog.open(AsignaPreguntasComponent, {
      width: '70%',
      height: '80%',
      position: {
        top: '0%'
      },
      // Pasamos los parametros necesarios
      data: {
        profesorId: this.profesorId,
        numeroDePuntosGeolocalizables: this.numeroDePuntosGeolocalizables

      }
    });
    dialogRef.afterClosed().subscribe(() => {
      this.PreguntasBasicas = this.sesion.DameIdPreguntasBasicas();
      this.PreguntasBonus = this.sesion.DameIdPreguntasBonus();
      this.tengoPreguntas = true;
      console.log ('comprobacion de que se reciben los id de las preguntas');
      console.log (this.PreguntasBasicas);
      console.log (this.PreguntasBonus);

    });
  }


  // Para habilitar el boton de guardar puntuaciones
  TengoPuntuacionesGeocatching() {
    if (this.myForm.value.PuntuacionCorrectaGeo === '' ||
        this.myForm.value.PuntuacionIncorrectaGeo === '' ||
        this.myForm.value.PuntuacionCorrectaGeoBonus === '' ||
        this.myForm.value.PuntuacionIncorrectaGeoBonus === '') {
      return false;
    } else {
      return true;
    }
  }
  GuardarPuntuacionGeocaching() {
    this.puntuacionCorrectaGeo = this.myForm.value.PuntuacionCorrectaGeo;
    this.puntuacionIncorrectaGeo = this.myForm.value.PuntuacionIncorrectaGeo;
    this.puntuacionCorrectaGeoBonus = this.myForm.value.PuntuacionCorrectaGeoBonus;
    this.puntuacionIncorrectaGeoBonus = this.myForm.value.PuntuacionIncorrectaGeoBonus;
  }

  CrearJuegoDeGeocaching() {
    // tslint:disable-next-line:max-line-length
    this.peticionesAPI.CreaJuegoDeGeocaching(new JuegoDeGeocaching(this.nombreDelJuego, this.tipoDeJuegoSeleccionado, this.puntuacionCorrectaGeo, this.puntuacionIncorrectaGeo, this.puntuacionCorrectaGeoBonus, this.puntuacionIncorrectaGeoBonus, this.PreguntasBasicas, this.PreguntasBonus,
      false, false, this.profesorId, this.grupo.id, this.escenario.id), this.grupo.id)
    .subscribe(juegoCreado => {
      this.juegoDeGeocaching = juegoCreado;
      this.juegoCreado = true;
      // Inscribimos a los alumnos en el juego
      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnosGrupo.length; i++) {
        // tslint:disable-next-line:max-line-length
        this.peticionesAPI.InscribeAlumnoJuegoDeGeocaching(new AlumnoJuegoDeGeocaching(0, 0, this.alumnosGrupo[i].id, this.juegoDeGeocaching.id ))
        .subscribe();
      }
      Swal.fire('Juego de geocaching creado correctamente', ' ', 'success');

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosPreparados === undefined) {
        // Si la lista aun no se ha creado no podre hacer el push
            this.juegosPreparados = [];
        }
      this.juegosPreparados.push (this.juegoDeGeocaching);
        // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.Limpiar();
       // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;
    });
  }

  // Funciones para crear juego de votación
  // Para crear el juego de votación de tipo Uno A Todos se usa la tabla
  // de asignación de puntuaciones que ya se usa en la competición de Formula Uno
  // junto con las funciones asociadas, porque lo que hay que hacer es exactamente lo mismo

  TipoDeVotacionSeleccionado(tipoVotacion: ChipColor) {
    this.tipoDeVotacionSeleccionado = tipoVotacion.nombre;
    this.tengoTipoDeVotacion = true;
  }

  ModoDeRepartoSeleccionado(modoReparto: ChipColor) {
    this.modoDeRepartoSeleccionado = modoReparto.nombre;
    this.tengoModoReparto = true;
  }
  // formatLabel(value: number) {
  //   // if (value >= 1000) {
  //   //   return Math.round(value / 1000) + 'k';
  //   // }

  //   this.puntosARepartir = value;
  //   console.log ('aaaa: ' + value);
  //   console.log ('bbb: ' + this.puntosARepartir);
  //   return value;
  // }
  GuardaValor(event) {
    this.puntosARepartir = event.value;
    this.Puntuacion[0] = this.puntosARepartir;
  }

CrearJuegoDeVotacionUnoATodos() {
    const juegoDeVotacion = new JuegoDeVotacionUnoATodos (
      this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeVotacionSeleccionado ,
      this.modoDeJuegoSeleccionado,
      this.modoDeRepartoSeleccionado,
      true,
      this.Puntuacion,
      this.nombreDelJuego,
      false,
      this.grupo.id);
    this.peticionesAPI.CreaJuegoDeVotacionUnoATodos (juegoDeVotacion, this.grupo.id)
    .subscribe (juegoCreado => {
      this.juego = juegoCreado;
      this.sesion.TomaJuego(this.juego);
      this.juegoCreado = true;

      if (this.modoDeJuegoSeleccionado === 'Individual') {

        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < this.alumnosGrupo.length; i++) {
          // tslint:disable-next-line:max-line-length
          this.peticionesAPI.InscribeAlumnoJuegoDeVotacionUnoATodos(
            // tslint:disable-next-line:indent
		          new AlumnoJuegoDeVotacionUnoATodos(this.alumnosGrupo[i].id, this.juego.id))
          .subscribe();
        }
      }

      Swal.fire('Juego de votación tipo Uno A Todos creado correctamente', ' ', 'success');

      // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
      if (this.juegosActivos === undefined) {
      // Si la lista aun no se ha creado no podre hacer el push
              this.juegosActivos = [];
      }
      this.juegosActivos.push (this.juego);
      // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
      this.Limpiar();
      // Regresamos a la lista de equipos (mat-tab con índice 0)
      this.tabGroup.selectedIndex = 0;

    });

  }

PonConcepto() {

  this.listaConceptos.push ({nombre: this.myForm.value.NombreDelConcepto, peso: this.myForm.value.PesoDelConcepto});
  this.dataSourceConceptos = new MatTableDataSource (this.listaConceptos);
  let peso: number;
  peso = Number (this.myForm.value.PesoDelConcepto);
  this.totalPesos = this.totalPesos + peso;
  console.log ('total ' + this.totalPesos);

  this.myForm.reset();

}


BorraConcepto(nombre) {
  // tslint:disable-next-line:prefer-for-of
  for (let i = 0; i < this.listaConceptos.length; i++) {
    if (this.listaConceptos[i]['nombre'] === nombre) {
      this.totalPesos = this.totalPesos - this.listaConceptos[i]['peso'];
      this.listaConceptos.splice ( i, 1);
    }
  }
  this.dataSourceConceptos = new MatTableDataSource (this.listaConceptos);

}

AsignarConceptos() {
  this.conceptos = [];
  this.pesos = [];


  if (this.totalPesos !== 100) {
    Swal.fire('Los pesos no suman el 100%', ' ', 'error');
  } else {
    this.listaConceptos.forEach (concepto => {
      this.conceptos.push (concepto['nombre']);
      this.pesos.push (concepto['peso']);
    });
    this.conceptosAsignados = true;
  }
}

CrearJuegoDeVotacionTodosAUno() {
  const juegoDeVotacion = new JuegoDeVotacionTodosAUno (
    this.tipoDeJuegoSeleccionado + ' ' + this.tipoDeVotacionSeleccionado ,
    this.modoDeJuegoSeleccionado,
    true,
    this.conceptos,
    this.pesos,
    this.nombreDelJuego,
    false,
    this.grupo.id);
  console.log ('voy a crear juego');
  console.log (juegoDeVotacion);
  this.peticionesAPI.CreaJuegoDeVotacionTodosAUno (juegoDeVotacion, this.grupo.id)
  .subscribe (juegoCreado => {
    this.juego = juegoCreado;
    this.sesion.TomaJuego(this.juego);
    this.juegoCreado = true;

    if (this.modoDeJuegoSeleccionado === 'Individual') {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnosGrupo.length; i++) {
        // tslint:disable-next-line:max-line-length
        this.peticionesAPI.InscribeAlumnoJuegoDeVotacionTodosAUno(
            new AlumnoJuegoDeVotacionTodosAUno(this.alumnosGrupo[i].id, this.juego.id))
        .subscribe();
      }
    }

    Swal.fire('Juego de votación tipo Todos A Uno creado correctamente', ' ', 'success');

    // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
    if (this.juegosActivos === undefined) {
    // Si la lista aun no se ha creado no podre hacer el push
            this.juegosActivos = [];
    }
    this.juegosActivos.push (this.juego);
    // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.Limpiar();
    // Regresamos a la lista de equipos (mat-tab con índice 0)
    this.tabGroup.selectedIndex = 0;

  });
}


///////////////// FUNCIONES PARA CREAR JUEGO DE CUESTIONARIO DE SATISFACCION /////////////

RecibeCuestionarioSatisfaccionElegido($event) {
  this.cuestionarioSatisfaccion = $event;
  this.tengoCuestionarioSatisfaccion = true;
  console.log ('tengo cuestionario: ' + this.cuestionarioSatisfaccion.Titulo);
}
GuardaDescripcionCuestionarioSatisfaccion(ev) {
  this.cuestionarioSatisfaccion.Descripcion = ev.target.value;
}

CrearJuegoDeCuestionarioDeSatisfaccion() {
  console.log ('voy a crear el juego');
  console.log ('cuestionario: ' + this.cuestionarioSatisfaccion.Titulo);
  console.log ('Descripcion: ' + this.cuestionarioSatisfaccion.Descripcion);
  const juegoDeCuestionarioSatisfaccion = new JuegoDeCuestionarioSatisfaccion (
    this.nombreDelJuego,
    this.tipoDeJuegoSeleccionado,
    this.cuestionarioSatisfaccion.Descripcion,
    true,
    false,
    this.profesorId,
    this.grupo.id,
    this.cuestionarioSatisfaccion.id);

  console.log ('voy a crear juego');
  console.log (juegoDeCuestionarioSatisfaccion);
  this.peticionesAPI.CreaJuegoDeCuestionarioSatisfaccion (juegoDeCuestionarioSatisfaccion, this.grupo.id)
  .subscribe (juegoCreado => {
    this.juego = juegoCreado;
    this.sesion.TomaJuego(this.juego);
    this.juegoCreado = true;

    if (this.modoDeJuegoSeleccionado === 'Individual') {

      // tslint:disable-next-line:prefer-for-of
      for (let i = 0; i < this.alumnosGrupo.length; i++) {
        // tslint:disable-next-line:max-line-length
        this.peticionesAPI.InscribeAlumnoJuegoDeCuestionarioSatisfaccion (
            new AlumnoJuegoDeCuestionarioSatisfaccion(false, this.juego.id, this.alumnosGrupo[i].id))
        .subscribe();
      }
    }

    Swal.fire('Juego de cuestionario de satisfacción creado correctamente', ' ', 'success');

    // El juego se ha creado como activo. Lo añadimos a la lista correspondiente
    if (this.juegosActivos === undefined) {
    // Si la lista aun no se ha creado no podre hacer el push
            this.juegosActivos = [];
    }
    this.juegosActivos.push (this.juego);
    // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.Limpiar();
    // Regresamos a la lista de equipos (mat-tab con índice 0)
    this.tabGroup.selectedIndex = 0;

  });

}

goBack() {
    this.location.back();
  }

canExit(): Observable <boolean> {
    console.log ('voy a salir');
    console.log (this.creandoJuego);
    if (!this.creandoJuego) {
      return of (true);
    } else {
      const confirmacionObservable = new Observable <boolean>( obs => {
          const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
            height: '150px',
            data: {
              mensaje: 'Confirma que quieres abandonar el proceso de creación del juego',
            }
          });

          dialogRef.afterClosed().subscribe((confirmed: boolean) => {
            if (confirmed) {
              this.Limpiar();
            }
            obs.next (confirmed);
          });
      });
      return confirmacionObservable;
    }
  }

  // Funciones Para creacion de Competicion Formula Uno
  // Para averiguar si todas las filas están seleccionadas */
IsAllSelected() {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /* Cuando se clica en el checkbox de cabecera hay que ver si todos los
    * checkbox estan acivados, en cuyo caso se desactivan todos, o si hay alguno
    * desactivado, en cuyo caso se activan todos */

MasterToggle() {
    if (this.IsAllSelected()) {
      this.selection.clear(); // Desactivamos todos
    } else {
      // activamos todos
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
  }

Limpiar() {
    // Al darle al botón de finalizar limpiamos el formulario y reseteamos el stepper
    this.stepper.reset();
    this.myForm.reset();
    this.tengoNombre = false;
    this.tengoTipo = false;
    this.tengoModo = false;

    this.puntosDelJuego = [];
    this.nivelesDelJuego = [];
    this.logosNiveles = [];


    this.coleccionSeleccionada = undefined;
    this.tengoColeccion = false;

    this.creandoJuego = false;
    this.juegoCreado = false;

    this.modoPresentacion = undefined;
    this.puntuacionCorrecta = undefined;
    this.puntuacionIncorrecta = undefined;
    this.cuestionario = undefined;
    this.tengoCuestionario = false;
    this.tengoModoPresentacion = false;

    this.familiasElegidas = undefined;
    this.tengoFamilias = false;



    this.tengoNumeroDeJornadas = false;
    this.tengoTipoDeCompeticion = false;
    this.tengoTipoDeTorneo = false;
    this.tengoNuevaPuntuacion = false;

    this.puntuacionCorrectaGeo = undefined;
    this.puntuacionIncorrectaGeo = undefined;
    this.puntuacionCorrectaGeoBonus = undefined;
    this.puntuacionIncorrectaGeoBonus = undefined;
    this.escenario = undefined;
    this.tengoEscenario = false;

    this.puntosgeolocalizablesEscenario = undefined;
    this.PreguntasBasicas = undefined;
    this.PreguntasBonus = undefined;
    this.tengoPreguntas = false;

    this.conceptosAsignados = false;
    this.listaConceptos = [];
    this.totalPesos = 0;
    this.tengoModoReparto = true;

  }
}
