import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BaseApi } from '../../shared/infrastructure/base-api';
import { ConductoresApiEndpoint } from './conductores-api-endpoint';
import { PasajerosApiEndpoint } from './pasajeros-api-endpoint';
import { TurnosApiEndpoint } from './turnos-api-endpoint';
import { AlertasApiEndpoint } from './alertas-api-endpoint';
import { Conductor } from '../domain/model/conductor.entity';
import { Turno } from '../domain/model/turno.entity';
import { Alerta } from '../domain/model/alerta.entity';
import { Pasajero } from '../domain/model/pasajero.entity';

@Injectable({ providedIn: 'root' })
export class ConductorApi extends BaseApi {
  private readonly conductoresEndpoint: ConductoresApiEndpoint;
  private readonly turnosEndpoint: TurnosApiEndpoint;
  private readonly alertasEndpoint: AlertasApiEndpoint;
  private readonly pasajerosEndpoint: PasajerosApiEndpoint;

  constructor(http: HttpClient) {
    super();
    this.conductoresEndpoint = new ConductoresApiEndpoint(http);
    this.turnosEndpoint      = new TurnosApiEndpoint(http);
    this.alertasEndpoint     = new AlertasApiEndpoint(http);
    this.pasajerosEndpoint   = new PasajerosApiEndpoint(http);
  }

  // CONDUCTORES
  getConductores(): Observable<Conductor[]>             { return this.conductoresEndpoint.getAll(); }
  getConductorById(id: number): Observable<Conductor>  { return this.conductoresEndpoint.getById(id); }
  createConductor(c: Conductor): Observable<Conductor> { return this.conductoresEndpoint.create(c); }
  updateConductor(c: Conductor): Observable<Conductor> { return this.conductoresEndpoint.update(c, c.id); }
  deleteConductor(id: number): Observable<void>        { return this.conductoresEndpoint.delete(id); }

  // TURNOS
  getTurnos(): Observable<Turno[]>           { return this.turnosEndpoint.getAll(); }
  getTurnoById(id: number): Observable<Turno>{ return this.turnosEndpoint.getById(id); }
  createTurno(t: Turno): Observable<Turno>   { return this.turnosEndpoint.create(t); }
  updateTurno(t: Turno): Observable<Turno>   { return this.turnosEndpoint.update(t, t.id); }

  // ALERTAS
  getAlertas(): Observable<Alerta[]>          { return this.alertasEndpoint.getAll(); }
  createAlerta(a: Alerta): Observable<Alerta> { return this.alertasEndpoint.create(a); }
  updateAlerta(a: Alerta): Observable<Alerta> { return this.alertasEndpoint.update(a, a.id); }

  // PASAJEROS
  getPasajeros(): Observable<Pasajero[]>            { return this.pasajerosEndpoint.getAll(); }
  createPasajero(p: Pasajero): Observable<Pasajero> { return this.pasajerosEndpoint.create(p); }
  updatePasajero(p: Pasajero): Observable<Pasajero> { return this.pasajerosEndpoint.update(p, p.id); }
}
