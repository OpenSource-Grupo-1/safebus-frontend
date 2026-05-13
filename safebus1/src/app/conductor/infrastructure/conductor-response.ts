import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface ConductorResource extends BaseResource {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  codigoEmpleado: string;
  codigoQr: string;
  placa: string;
  estado: string;
  foto: string;
}

export interface ConductoresResponse extends BaseResponse {
  conductores: ConductorResource[];
}
