import { Injectable, signal, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface UnidadTrack {
  id: number;           // id real del BusUnit en el backend
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
  id: number;           // id real del Alert en el backend
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

/** Datos fijos que solo existen en el frontend: a qué conductor pertenece cada placa. */
const PLACA_A_CONDUCTOR: Record<string, { codigoEmpleado: string; nombre: string }> = {
  'ABC-1234': { codigoEmpleado: 'EMP-001', nombre: 'Marcos E. Silva' },
  'DEF-5678': { codigoEmpleado: 'EMP-002', nombre: 'Juan Quispe' },
  'GHI-9012': { codigoEmpleado: 'EMP-003', nombre: 'Pedro Mamani' },
  'JKL-3456': { codigoEmpleado: 'EMP-004', nombre: 'Miguel Flores' },
  'MNO-7890': { codigoEmpleado: 'EMP-005', nombre: 'Luis Ccama' },
  'PQR-1234': { codigoEmpleado: 'EMP-006', nombre: 'Carlos Huanca' },
  'STU-5678': { codigoEmpleado: 'EMP-007', nombre: 'Roberto Apaza' },
};

/**
 * Simula el movimiento en tiempo real de la flota y las alertas, y las
 * persiste de verdad en el backend (bus_units y alerts) para que Swagger
 * y MySQL Workbench muestren datos reales, no solo el frontend.
 */
@Injectable({ providedIn: 'root' })
export class FleetTrackingService {
  private http = inject(HttpClient);
  private baseUrl = environment.platformProviderApiBaseUrl;

  readonly unidades = signal<UnidadTrack[]>([]);
  readonly alertas = signal<AlertaTrack[]>([]);

  /** placa -> id real del BusUnit en el backend */
  private busUnitIds = new Map<string, number>();
  /** codigoEmpleado -> id real del Employee en el backend */
  private employeeIds = new Map<string, number>();

  private headings = new Map<number, number>();
  private intervalRef: ReturnType<typeof setInterval> | null = null;
  private alertaIntervalRef: ReturnType<typeof setInterval> | null = null;
  private codigoPropio = signal<string | null>(null);
  private listo = false;

  private tiposAleatorios: { tipo: string; nivel: AlertaTrack['nivel'] }[] = [
    { tipo: 'PÁNICO', nivel: 'CRITICO' },
    { tipo: 'VELOCIDAD', nivel: 'ALTO' },
    { tipo: 'DESVÍO', nivel: 'MEDIO' },
  ];

  constructor() {
    this.cargarDesdeBackend();
  }

  /** Trae las unidades y empleados reales del backend para arrancar con datos verdaderos. */
  private cargarDesdeBackend() {
    forkJoin({
      unidades: this.http.get<any[]>(`${this.baseUrl}/bus-units`).pipe(catchError(() => of(null))),
      empleados: this.http.get<any[]>(`${this.baseUrl}/employees`).pipe(catchError(() => of(null))),
    }).subscribe(({ unidades, empleados }) => {
      if (empleados) {
        for (const e of empleados) this.employeeIds.set(e.employeeCode, e.id);
      }

      if (unidades && unidades.length > 0) {
        const lista: UnidadTrack[] = unidades.map((u: any) => {
          const info = PLACA_A_CONDUCTOR[u.plateNumber] ?? { codigoEmpleado: '', nombre: u.plateNumber };
          this.busUnitIds.set(u.plateNumber, u.id);
          return {
            id: u.id,
            placa: u.plateNumber,
            conductor: info.nombre,
            codigoEmpleado: info.codigoEmpleado,
            ruta: u.route,
            estado: 'ACTIVO',
            lat: u.currentLatitude,
            lng: u.currentLongitude,
            pasajeros: Math.floor(Math.random() * 40) + 5,
            velocidad: Math.floor(Math.random() * 40) + 35,
          };
        });
        this.unidades.set(lista);
      } else {
        // Respaldo si el backend no responde: la demo sigue viéndose bien.
        this.unidades.set(this.flotaDeRespaldo());
      }

      this.listo = true;
      this.iniciarSimulacion();
    });
  }

  private flotaDeRespaldo(): UnidadTrack[] {
    return Object.entries(PLACA_A_CONDUCTOR).map(([placa, info], i) => ({
      id: -(i + 1),
      placa,
      conductor: info.nombre,
      codigoEmpleado: info.codigoEmpleado,
      ruta: 'R-00',
      estado: 'ACTIVO',
      lat: -12.05 + Math.random() * 0.05,
      lng: -77.05 + Math.random() * 0.05,
      pasajeros: 20,
      velocidad: 45,
    }));
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
        const nuevoLat = u.lat + Math.cos(heading) * paso;
        const nuevoLng = u.lng + Math.sin(heading) * paso;
        this.persistirUbicacion(u.id, nuevoLat, nuevoLng);
        return { ...u, lat: nuevoLat, lng: nuevoLng };
      }));
    }, 2000);

    if (this.alertaIntervalRef) return;
    this.alertaIntervalRef = setInterval(() => {
      if (Math.random() > 0.3) return;
      const candidatos = this.unidades().filter(u => u.estado === 'ACTIVO' && u.codigoEmpleado !== this.codigoPropio());
      if (candidatos.length === 0) return;
      const unidad = candidatos[Math.floor(Math.random() * candidatos.length)];
      const { tipo, nivel } = this.tiposAleatorios[Math.floor(Math.random() * this.tiposAleatorios.length)];
      this.crearAlerta(unidad, tipo, nivel);
    }, 20000);
  }

  /** Guarda la nueva ubicación en el backend (bus_units). Si falla, no rompe la demo. */
  private persistirUbicacion(busUnitId: number, lat: number, lng: number) {
    if (busUnitId < 0) return; // unidad de respaldo, sin id real
    this.http.patch(`${this.baseUrl}/bus-units/${busUnitId}/location`, { latitude: lat, longitude: lng })
      .pipe(catchError(() => of(null)))
      .subscribe();
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
      const nuevoLat = u.lat + Math.cos(heading) * paso;
      const nuevoLng = u.lng + Math.sin(heading) * paso;
      this.persistirUbicacion(u.id, nuevoLat, nuevoLng);
      return { ...u, lat: nuevoLat, lng: nuevoLng };
    }));
  }

  triggerPanic(codigoEmpleado: string) {
    const unidad = this.getUnidadByCodigo(codigoEmpleado);
    if (!unidad) return;
    this.crearAlerta(unidad, 'PÁNICO', 'CRITICO');
  }

  private crearAlerta(unidad: UnidadTrack, tipo: string, nivel: AlertaTrack['nivel']) {
    this.unidades.update(list => list.map(u => u.id === unidad.id ? { ...u, estado: 'ALERTA' } : u));
    const hora = new Date().toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' });

    const employeeId = this.employeeIds.get(unidad.codigoEmpleado);
    const busUnitId = unidad.id;

    // Empuja el estado local de inmediato, para que la demo no espere a la red.
    const provisional: AlertaTrack = {
      id: -Date.now(), tipo, bus: unidad.placa, conductor: unidad.conductor,
      codigoEmpleado: unidad.codigoEmpleado, hora, nivel, resuelta: false,
      lat: unidad.lat, lng: unidad.lng,
    };
    this.alertas.update(list => [provisional, ...list]);

    if (employeeId === undefined || busUnitId < 0) return; // sin ids reales, se queda solo local

    this.http.post<any>(`${this.baseUrl}/alerts`, {
      employeeId, busUnitId, alertType: tipo, description: `Alerta ${tipo} generada en unidad ${unidad.placa}`,
      latitude: unidad.lat, longitude: unidad.lng,
    }).pipe(catchError(() => of(null))).subscribe(respuesta => {
      if (!respuesta) return;
      // Reemplaza el id provisional por el id real que devolvió el backend.
      this.alertas.update(list => list.map(a => a.id === provisional.id ? { ...a, id: respuesta.id } : a));
    });
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
    if (id > 0) {
      this.http.patch(`${this.baseUrl}/alerts/${id}/resolve`, {})
        .pipe(catchError(() => of(null)))
        .subscribe();
    }
  }
}
