import { Injectable, signal, computed, inject } from '@angular/core';
import { Conductor } from '../domain/model/conductor.entity';
import { Turno } from '../domain/model/turno.entity';
import { FleetTrackingService } from '../../shared/infrastructure/fleet-tracking.service';

@Injectable({ providedIn: 'root' })
export class ConductorStateService {
  private fleet = inject(FleetTrackingService);

  readonly conductorActual = signal<Conductor | null>(null);
  readonly turnoActual     = signal<Turno | null>(null);
  readonly turnoActivo     = signal(false);

  readonly tiempoSegundos = signal(0);
  readonly distanciaKm    = signal(0);
  readonly pasajeros      = signal(0);
  readonly recaudacion    = signal(0);

  readonly tiempoStr = computed(() => {
    const s = this.tiempoSegundos();
    const h = Math.floor(s / 3600).toString().padStart(2, '0');
    const m = Math.floor((s % 3600) / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${h}:${m}:${sec}`;
  });

  private timer: ReturnType<typeof setInterval> | null = null;

  setConductor(c: Conductor) {
    this.conductorActual.set(c);
    this.fleet.setCodigoPropio(c.codigoEmpleado);
  }

  clearConductor() {
    this.conductorActual.set(null);
    this.turnoActual.set(null);
    this.turnoActivo.set(false);
    this.fleet.setCodigoPropio(null);
    this.detenerTimer();
  }

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
    this.tiempoSegundos.set(0);
    this.distanciaKm.set(0);
    this.pasajeros.set(0);
    this.recaudacion.set(0);
    this.iniciarTimer();
  }

  private iniciarTimer() {
    this.detenerTimer();
    this.timer = setInterval(() => {
      if (!this.turnoActivo()) return;

      this.tiempoSegundos.update(v => v + 1);
      const deltaKm = 0.003;
      this.distanciaKm.update(v => +(v + deltaKm).toFixed(3));

      if (this.tiempoSegundos() % 15 === 0) {
        this.pasajeros.update(v => v + Math.floor(Math.random() * 3));
        this.recaudacion.update(v => +(v + Math.random() * 2.5).toFixed(2));
      }

      const codigo = this.conductorActual()?.codigoEmpleado;
      if (codigo) this.fleet.moverUnidadPorDistancia(codigo, deltaKm);

      const t = this.turnoActual();
      if (t) {
        t.tiempoSegundos = this.tiempoSegundos();
        t.distanciaKm    = this.distanciaKm();
        t.pasajeros       = this.pasajeros();
        t.recaudacion     = this.recaudacion();
      }
    }, 1000);
  }

  private detenerTimer() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  finalizarTurno() {
    const t = this.turnoActual();
    if (t) { t.estado = 'FINALIZADO'; t.fechaFin = new Date(); }
    this.turnoActivo.set(false);
    this.detenerTimer();
  }
}
