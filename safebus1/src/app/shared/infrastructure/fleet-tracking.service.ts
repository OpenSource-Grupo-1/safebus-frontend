import { Injectable, signal } from '@angular/core';

export interface UnidadTrack {
  id: number;
  placa: string;
  conductor: string;
  codigoEmpleado: string;
  ruta: string;
  estado: 'ACTIVO' | 'INACTIVO' | 'ALERTA';
  lat: number;
  lng: number;
  pasajeros: number;
  velocidad: number;
}

export interface AlertaTrack {
  id: number;
  tipo: string;
  bus: string;
  conductor: string;
  hora: string;
  nivel: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  resuelta: boolean;
  lat: number;
  lng: number;
}

/**
 * Simula el movimiento en tiempo real de la flota de buses y centraliza
 * las alertas de panico para que el conductor y el panel de administracion
 * compartan el mismo estado dentro de la sesion del navegador
 */
@Injectable({ providedIn: 'root' })
export class FleetTrackingService {
  readonly unidades = signal<UnidadTrack[]>([
    { id: 1, placa: 'ABC-1234', conductor: 'Marcos E. Silva', codigoEmpleado: 'EMP-001', ruta: 'R-42', estado: 'ACTIVO',   lat: -12.0464, lng: -77.0428, pasajeros: 32, velocidad: 48 },
    { id: 2, placa: 'DEF-5678', conductor: 'Juan Quispe',     codigoEmpleado: 'EMP-002', ruta: 'R-15', estado: 'ACTIVO',   lat: -12.0600, lng: -77.0300, pasajeros: 18, velocidad: 52 },
    { id: 3, placa: 'GHI-9012', conductor: 'Pedro Mamani',    codigoEmpleado: 'EMP-003', ruta: 'R-07', estado: 'ACTIVO',   lat: -12.0700, lng: -77.0500, pasajeros: 45, velocidad: 75 },
    { id: 4, placa: 'JKL-3456', conductor: 'Miguel Flores',   codigoEmpleado: 'EMP-004', ruta: 'R-22', estado: 'ACTIVO',   lat: -12.0900, lng: -77.0600, pasajeros: 10, velocidad: 40 },
    { id: 5, placa: 'MNO-7890', conductor: 'Luis Ccama',      codigoEmpleado: 'EMP-005', ruta: 'R-33', estado: 'INACTIVO', lat: -12.1000, lng: -77.0200, pasajeros: 0,  velocidad: 0  },
    { id: 6, placa: 'PQR-1234', conductor: 'Carlos Huanca',   codigoEmpleado: 'EMP-006', ruta: 'R-42', estado: 'ACTIVO',   lat: -12.0300, lng: -77.0100, pasajeros: 27, velocidad: 55 },
    { id: 7, placa: 'STU-5678', conductor: 'Roberto Apaza',   codigoEmpleado: 'EMP-007', ruta: 'R-08', estado: 'ACTIVO',   lat: -12.0200, lng: -77.0400, pasajeros: 38, velocidad: 43 },
  ]);

  readonly alertas = signal<AlertaTrack[]>([]);

  private headings = new Map<number, number>();
  private intervalRef: ReturnType<typeof setInterval> | null = null;

  constructor() {
    this.iniciarSimulacion();
  }

  /** Mueve todas las unidades activas de forma lenta y semi-aleatoria. */
  private iniciarSimulacion() {
    if (this.intervalRef) return;
    this.intervalRef = setInterval(() => {
      this.unidades.update(list => list.map(u => {
        if (u.estado === 'INACTIVO') return u;
        let heading = this.headings.get(u.id);
        if (heading === undefined || Math.random() < 0.15) {
          heading = Math.random() * Math.PI * 2;
          this.headings.set(u.id, heading);
        }
        const paso = 0.00012;
        return { ...u, lat: u.lat + Math.cos(heading) * paso, lng: u.lng + Math.sin(heading) * paso };
      }));
    }, 2000);
  }

  getUnidadByCodigo(codigoEmpleado: string): UnidadTrack | undefined {
    return this.unidades().find(u => u.codigoEmpleado === codigoEmpleado);
  }

  /** Avanza la unidad del conductor logueado según la distancia que va recorriendo. */
  moverUnidadPorDistancia(codigoEmpleado: string, deltaKm: number) {
    this.unidades.update(list => list.map(u => {
      if (u.codigoEmpleado !== codigoEmpleado || u.estado === 'INACTIVO') return u;
      let heading = this.headings.get(u.id);
      if (heading === undefined || Math.random() < 0.2) {
        heading = Math.random() * Math.PI * 2;
        this.headings.set(u.id, heading);
      }
      const paso = deltaKm * 0.009;
      return { ...u, lat: u.lat + Math.cos(heading) * paso, lng: u.lng + Math.sin(heading) * paso };
    }));
  }

  triggerPanic(codigoEmpleado: string) {
    const unidad = this.getUnidadByCodigo(codigoEmpleado);
    if (!unidad) return;
    this.unidades.update(list => list.map(u => u.id === unidad.id ? { ...u, estado: 'ALERTA' } : u));
    const hora = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const nueva: AlertaTrack = {
      id: Date.now(),
      tipo: 'PÁNICO',
      bus: unidad.placa,
      conductor: unidad.conductor,
      hora,
      nivel: 'CRITICO',
      resuelta: false,
      lat: unidad.lat,
      lng: unidad.lng,
    };
    this.alertas.update(list => [nueva, ...list]);
  }

  resolverAlerta(id: number) {
    let placaResuelta: string | null = null;
    this.alertas.update(list => list.map(a => {
      if (a.id === id) { placaResuelta = a.bus; return { ...a, resuelta: true }; }
      return a;
    }));
    if (placaResuelta) {
      this.unidades.update(list => list.map(u =>
        u.placa === placaResuelta && u.estado === 'ALERTA' ? { ...u, estado: 'ACTIVO' } : u
      ));
    }
  }
}
