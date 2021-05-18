import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Location } from '@angular/common';
// Clases
import { Alumno, Equipo, Juego, AlumnoJuegoDeCompeticionTorneo, EquipoJuegoDeCompeticionTorneo,
          EnfrentamientoTorneo } from '../../../clases/index';

// Servicio
import { SesionService, PeticionesAPIService, CalculosService } from '../../../servicios/index';

// Imports para abrir diálogo y swal
import { MatDialog } from '@angular/material';
import { DialogoConfirmacionComponent } from '../../COMPARTIDO/dialogo-confirmacion/dialogo-confirmacion.component';
import Swal from 'sweetalert2';


@Component({
  selector: 'app-juego-de-competicion-torneo-seleccionado-activo',
  templateUrl: './juego-de-competicion-torneo-seleccionado-activo.component.html',
  styleUrls: ['./juego-de-competicion-torneo-seleccionado-activo.component.scss']
})
export class JuegoDeCompeticionTorneoSeleccionadoActivoComponent implements OnInit {

  // Juego De CompeticionLiga seleccionado
  juegoSeleccionado: Juego;

  constructor(  public dialog: MatDialog,
                public sesion: SesionService,
                public peticionesAPI: PeticionesAPIService,
                public calculos: CalculosService,
                private location: Location) {}

  ngOnInit() {
    this.juegoSeleccionado = this.sesion.DameJuego();
    console.log ('juego de liga que estamos probando');
    console.log(this.juegoSeleccionado);
  
  }


 

  DesactivarJuego() {
    console.log(this.juegoSeleccionado);
    this.peticionesAPI.CambiaEstadoJuegoDeCompeticionLiga(new Juego (this.juegoSeleccionado.Tipo, this.juegoSeleccionado.Modo,
      this.juegoSeleccionado.Asignacion,
      undefined, false, this.juegoSeleccionado.NumeroTotalJornadas, this.juegoSeleccionado.TipoJuegoCompeticion, undefined, 
      this.juegoSeleccionado.NumeroParticipantesPuntuan, this.juegoSeleccionado.Puntos, this.juegoSeleccionado.NombreJuego),
      this.juegoSeleccionado.id, this.juegoSeleccionado.grupoId).subscribe(res => {
        if (res !== undefined) {
          console.log(res);
          console.log('juego desactivado');
          this.location.back();
        }
      });
  }

  /*/AbrirDialogoConfirmacionDesactivar(): void {

    const dialogRef = this.dialog.open(DialogoConfirmacionComponent, {
      height: '150px',
      data: {
        mensaje: this.mensaje,
        nombre: this.juegoSeleccionado.Tipo,
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.DesactivarJuego();
        Swal.fire('Desactivado', this.juegoSeleccionado.Tipo + ' desactivado correctamente', 'success');
      }
    });
  }
/*/
 

}
