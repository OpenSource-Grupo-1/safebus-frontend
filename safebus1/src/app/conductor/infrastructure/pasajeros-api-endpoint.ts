import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Pasajero } from '../domain/model/pasajero.entity';
import { PasajeroResource, PasajerosResponse } from './pasajeros-response';
import { PasajeroAssembler } from './pasajero-assembler';
import { environment } from '../../../environments/environment';

export class PasajerosApiEndpoint extends BaseApiEndpoint<Pasajero, PasajeroResource, PasajerosResponse, PasajeroAssembler> {
  constructor(http: HttpClient) {
    super(http, environment.platformProviderApiBaseUrl + environment.platformProviderPasajerosEndpointPath, new PasajeroAssembler());
  }
}
