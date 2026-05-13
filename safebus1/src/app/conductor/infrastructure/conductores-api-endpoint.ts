import { HttpClient } from '@angular/common/http';
import { BaseApiEndpoint } from '../../shared/infrastructure/base-api-endpoint';
import { Conductor } from '../domain/model/conductor.entity';
import { ConductorResource, ConductoresResponse } from './conductor-response';
import { ConductorAssembler } from './conductor-assembler';
import { environment } from '../../../environments/environment';

export class ConductoresApiEndpoint extends BaseApiEndpoint<Conductor, ConductorResource, ConductoresResponse, ConductorAssembler> {
  constructor(http: HttpClient) {
    super(http, environment.platformProviderApiBaseUrl + environment.platformProviderConductoresEndpointPath, new ConductorAssembler());
  }
}
