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
  codigoEmpleado: string;
  hora: string;
  nivel: 'CRITICO' | 'ALTO' | 'MEDIO' | 'BAJO';
  resuelta: boolean;
  lat: number;
  lng: number;
}

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

  /** Código del conductor logueado actualmente — sus alertas NUNCA se generan solas. */
  private codigoPropio = signal<string | null>(null);

  private headings = new Map<number, number>();
  private intervalRef: ReturnType<typeof setInterval> | null = null;
  private alertaIntervalRef: ReturnType<typeof setInterval> | null = null;

  private tiposAleatorios: { tipo: string; nivel: AlertaTrack['nivel'] }[] = [
    { tipo: 'PÁNICO',    nivel: 'CRITICO' },
    { tipo: 'VELOCIDAD', nivel: 'ALTO' },
    { tipo: 'DESVÍO',    nivel: 'MEDIO' },
  ];

  constructor() {
    this.iniciarSimulacion();
    this.iniciarAlertasAleatorias();
  }

  setCodigoPropio(codigo: string | null) {
    this.codigoPropio.set(codigo);
  }

  private iniciarSimulacion() {
    if (this.intervalRef) return;
    this.intervalRef = setInterval(() => {
      this.unidades.update(list => list.map(u => {
        if (u.estado === 'INACTIVO') return u;
        let heading = this.headings.get(u.id);
        if (heading === undefined || Math.random() < 0.08) {
          heading = Math.random() * Math.PI * 2;
          this.headings.set(u.id, heading);
        }
        const paso = 0.0004;
        return { ...u, lat: u.lat + Math.cos(heading) * paso, lng: u.lng + Math.sin(heading) * paso };
      }));
    }, 2000);
  }

  /** Cada cierto tiempo, con cierta probabilidad, otra unidad (nunca la tuya) entra en alerta sola. */
  private iniciarAlertasAleatorias() {
    if (this.alertaIntervalRef) return;
    this.alertaIntervalRef = setInterval(() => {
      if (Math.random() > 0.3) return; // ~30% de probabilidad cada 20s

      const candidatos = this.unidades().filter(u =>
        u.estado === 'ACTIVO' && u.codigoEmpleado !== this.codigoPropio()
      );
      if (candidatos.length === 0) return;

      const unidad = candidatos[Math.floor(Math.random() * candidatos.length)];
      const { tipo, nivel } = this.tiposAleatorios[Math.floor(Math.random() * this.tiposAleatorios.length)];
      this.crearAlerta(unidad, tipo, nivel);
    }, 20000);
  }

  getUnidadByCodigo(codigoEmpleado: string): UnidadTrack | undefined {
    return this.unidades().find(u => u.codigoEmpleado === codigoEmpleado);
  }

  moverUnidadPorDistancia(codigoEmpleado: string, deltaKm: number) {
    this.unidades.update(list => list.map(u => {
      if (u.codigoEmpleado !== codigoEmpleado || u.estado === 'INACTIVO') return u;
      let heading = this.headings.get(u.id);
      if (heading === undefined || Math.random() < 0.1) {
        heading = Math.random() * Math.PI * 2;
        this.headings.set(u.id, heading);
      }
      const paso = deltaKm * 0.03;
      return { ...u, lat: u.lat + Math.cos(heading) * paso, lng: u.lng + Math.sin(heading) * paso };
    }));
  }

  /** Disparado únicamente cuando el conductor logueado presiona pánico. */
  triggerPanic(codigoEmpleado: string) {
    const unidad = this.getUnidadByCodigo(codigoEmpleado);
    if (!unidad) return;
    this.crearAlerta(unidad, 'PÁNICO', 'CRITICO');
  }

  private crearAlerta(unidad: UnidadTrack, tipo: string, nivel: AlertaTrack['nivel']) {
    this.unidades.update(list => list.map(u => u.id === unidad.id ? { ...u, estado: 'ALERTA' } : u));
    const hora = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });
    const nueva: AlertaTrack = {
      id: Date.now(),
      tipo,
      bus: unidad.placa,
      conductor: unidad.conductor,
      codigoEmpleado: unidad.codigoEmpleado,
      hora,
      nivel,
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
