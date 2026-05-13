import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface TurnoResource extends BaseResource {
  id: number; conductorId: number; busId: string; rutaNombre: string;
  rutaOrigen: string; rutaDestino: string; distanciaKm: number;
  tiempoSegundos: number; pasajeros: number; recaudacion: number;
  estado: string; fechaInicio: string; fechaFin: string | null;
}
export interface TurnosResponse extends BaseResponse {
  turnos: TurnoResource[];
}
