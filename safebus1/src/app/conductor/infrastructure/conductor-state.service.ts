import { Injectable, signal } from '@angular/core';
import { Conductor } from '../domain/model/conductor.entity';
import { Turno } from '../domain/model/turno.entity';

@Injectable({ providedIn: 'root' })
export class ConductorStateService {
  readonly conductorActual = signal<Conductor | null>(null);
  readonly turnoActual     = signal<Turno | null>(null);
  readonly turnoActivo     = signal(false);

  setConductor(c: Conductor) { this.conductorActual.set(c); }
  clearConductor() { this.conductorActual.set(null); this.turnoActual.set(null); this.turnoActivo.set(false); }

  iniciarTurno(busId: string) {
    const c = this.conductorActual();
    if (!c) return;
    this.turnoActual.set(new Turno({
      id: Date.now(), conductorId: c.id, busId,
      rutaNombre: 'R-42', rutaOrigen: 'Terminal Norte', rutaDestino: 'Estación Central',
      distanciaKm: 0, tiempoSegundos: 0, pasajeros: 0, recaudacion: 0,
      estado: 'ACTIVO', fechaInicio: new Date(), fechaFin: null,
    }));
    this.turnoActivo.set(true);
  }

  finalizarTurno() {
    const t = this.turnoActual();
    if (t) { t.estado = 'FINALIZADO'; t.fechaFin = new Date(); }
    this.turnoActivo.set(false);
  }
}
