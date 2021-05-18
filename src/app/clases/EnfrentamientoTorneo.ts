export class EnfrentamientoTorneo {
  JugadorUno: number;
  JugadorDos: number;
  Ganador: number;
  id: number;

  constructor(JugadorUno?: number, JugadorDos?: number, Ganador?: number, id?: number) {

    this.JugadorUno = JugadorUno;
    this.JugadorDos = JugadorDos;
    this.Ganador = Ganador;
    this.id = id;
  }
}
