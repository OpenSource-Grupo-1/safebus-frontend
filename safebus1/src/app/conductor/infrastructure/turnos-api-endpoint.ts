import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Turno } from '../domain/model/turno.entity';
import { TurnoResource, TurnosResponse } from './turnos-response';
import { TurnoAssembler } from './turno-assembler';
import { environment } from '../../../environments/environment';

export class TurnosApiEndpoint extends BaseApiEndpoint<Turno, TurnoResource, TurnosResponse, TurnoAssembler> {
  constructor(http: HttpClient) {
    super(http, environment.platformProviderApiBaseUrl + environment.platformProviderTurnosEndpointPath, new TurnoAssembler());
  }
}
