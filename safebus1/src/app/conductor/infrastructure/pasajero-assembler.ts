import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Pasajero } from '../domain/model/pasajero.entity';
import { PasajeroResource, PasajerosResponse } from './pasajeros-response';

export class PasajeroAssembler implements BaseAssembler<Pasajero, PasajeroResource, PasajerosResponse> {
  toEntityFromResource(r: PasajeroResource): Pasajero {
    return new Pasajero({
      id: r.id, turnoId: r.turnoId, busId: r.busId,
      totalAbordaron: r.totalAbordaron, totalBajaron: r.totalBajaron,
      totalAbordo: r.totalAbordo, timestamp: new Date(r.timestamp), anomalia: r.anomalia,
    });
  }
  toResourceFromEntity(e: Pasajero): PasajeroResource {
    return {
      id: e.id, turnoId: e.turnoId, busId: e.busId,
      totalAbordaron: e.totalAbordaron, totalBajaron: e.totalBajaron,
      totalAbordo: e.totalAbordo, timestamp: e.timestamp.toISOString(), anomalia: e.anomalia,
    };
  }
  toEntitiesFromResponse(r: PasajerosResponse): Pasajero[] {
    return r.pasajeros.map(p => this.toEntityFromResource(p));
  }
}
