import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { JuegoDeCompeticionTorneoSeleccionadoActivoComponent } from './juego-de-competicion-torneo-seleccionado-activo.component';

describe('JuegoDeCompeticionTorneoSeleccionadoActivoComponent', () => {
  let component: JuegoDeCompeticionTorneoSeleccionadoActivoComponent;
  let fixture: ComponentFixture<JuegoDeCompeticionTorneoSeleccionadoActivoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ JuegoDeCompeticionTorneoSeleccionadoActivoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JuegoDeCompeticionTorneoSeleccionadoActivoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
