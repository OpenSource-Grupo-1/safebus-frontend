import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Alerta } from '../domain/model/alerta.entity';
import { AlertaResource, AlertasResponse } from './alertas-response';
import { AlertaAssembler } from './alerta-assembler';
import { environment } from '../../../environments/environment';

export class AlertasApiEndpoint extends BaseApiEndpoint<Alerta, AlertaResource, AlertasResponse, AlertaAssembler> {
  constructor(http: HttpClient) {
    super(http, environment.platformProviderApiBaseUrl + environment.platformProviderAlertasEndpointPath, new AlertaAssembler());
  }
}
