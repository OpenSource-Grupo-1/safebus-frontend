import { BaseResource, BaseResponse } from '../../shared/infrastructure/base-response';

export interface PasajeroResource extends BaseResource {
  id: number; turnoId: number; busId: string;
  totalAbordaron: number; totalBajaron: number;
  totalAbordo: number; timestamp: string; anomalia: boolean;
}
export interface PasajerosResponse extends BaseResponse {
  pasajeros: PasajeroResource[];
}
