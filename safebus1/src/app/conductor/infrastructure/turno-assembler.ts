import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Turno } from '../domain/model/turno.entity';
import { TurnoResource, TurnosResponse } from './turnos-response';

export class TurnoAssembler implements BaseAssembler<Turno, TurnoResource, TurnosResponse> {
  toEntityFromResource(r: TurnoResource): Turno {
    return new Turno({
      id: r.id, conductorId: r.conductorId, busId: r.busId,
      rutaNombre: r.rutaNombre, rutaOrigen: r.rutaOrigen, rutaDestino: r.rutaDestino,
      distanciaKm: r.distanciaKm, tiempoSegundos: r.tiempoSegundos,
      pasajeros: r.pasajeros, recaudacion: r.recaudacion,
      estado: r.estado as 'ACTIVO' | 'FINALIZADO',
      fechaInicio: new Date(r.fechaInicio),
      fechaFin: r.fechaFin ? new Date(r.fechaFin) : null,
    });
  }
  toResourceFromEntity(e: Turno): TurnoResource {
    return {
      id: e.id, conductorId: e.conductorId, busId: e.busId,
      rutaNombre: e.rutaNombre, rutaOrigen: e.rutaOrigen, rutaDestino: e.rutaDestino,
      distanciaKm: e.distanciaKm, tiempoSegundos: e.tiempoSegundos,
      pasajeros: e.pasajeros, recaudacion: e.recaudacion, estado: e.estado,
      fechaInicio: e.fechaInicio.toISOString(),
      fechaFin: e.fechaFin ? e.fechaFin.toISOString() : null,
    };
  }
  toEntitiesFromResponse(r: TurnosResponse): Turno[] {
    return r.turnos.map(t => this.toEntityFromResource(t));
  }
}
