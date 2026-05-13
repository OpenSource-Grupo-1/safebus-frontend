import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';
import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { UnidadBus } from '../domain/model/admin.entity';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';

export interface UnidadResource extends BaseResource {
  id: number; placa: string; conductor: string; ruta: string;
  estado: string; lat: number; lng: number; pasajeros: number; velocidad: number;
}
export interface UnidadesResponse extends BaseResponse {
  unidades: UnidadResource[];
}

export class UnidadAssembler implements BaseAssembler<UnidadBus, UnidadResource, UnidadesResponse> {
  toEntityFromResource(r: UnidadResource): UnidadBus {
    return new UnidadBus({ id:r.id, placa:r.placa, conductor:r.conductor, ruta:r.ruta,
      estado: r.estado as 'ACTIVO'|'INACTIVO'|'ALERTA', lat:r.lat, lng:r.lng, pasajeros:r.pasajeros, velocidad:r.velocidad });
  }
  toResourceFromEntity(e: UnidadBus): UnidadResource {
    return { id:e.id, placa:e.placa, conductor:e.conductor, ruta:e.ruta,
      estado:e.estado, lat:e.lat, lng:e.lng, pasajeros:e.pasajeros, velocidad:e.velocidad };
  }
  toEntitiesFromResponse(r: UnidadesResponse): UnidadBus[] {
    return r.unidades.map(u => this.toEntityFromResource(u));
  }
}

export class UnidadesApiEndpoint extends BaseApiEndpoint<UnidadBus, UnidadResource, UnidadesResponse, UnidadAssembler> {
  constructor(http: HttpClient) {
    super(http, environment.platformProviderApiBaseUrl + environment.platformProviderUnidadesEndpointPath, new UnidadAssembler());
  }
}
