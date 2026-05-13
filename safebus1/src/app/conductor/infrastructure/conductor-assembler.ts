import { BaseAssembler } from '../../shared/infrastructure/base-assembler';
import { Conductor } from '../domain/model/conductor.entity';
import { ConductorResource, ConductoresResponse } from './conductor-response';

export class ConductorAssembler implements BaseAssembler<Conductor, ConductorResource, ConductoresResponse> {
  toEntityFromResource(r: ConductorResource): Conductor {
    return new Conductor({
      id: r.id, nombre: r.nombre, apellido: r.apellido, dni: r.dni,
      codigoEmpleado: r.codigoEmpleado, codigoQr: r.codigoQr,
      placa: r.placa, estado: r.estado, foto: r.foto,
    });
  }
  toResourceFromEntity(e: Conductor): ConductorResource {
    return {
      id: e.id, nombre: e.nombre, apellido: e.apellido, dni: e.dni,
      codigoEmpleado: e.codigoEmpleado, codigoQr: e.codigoQr,
      placa: e.placa, estado: e.estado, foto: e.foto,
    };
  }
  toEntitiesFromResponse(r: ConductoresResponse): Conductor[] {
    return r.conductores.map(c => this.toEntityFromResource(c));
  }
}
