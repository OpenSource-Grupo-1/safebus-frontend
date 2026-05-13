import { BaseEntity } from '../../../shared/infrastructure/base-entity';

export class UnidadBus implements BaseEntity {
  id!: number; placa!: string; conductor!: string; ruta!: string;
  estado!: 'ACTIVO' | 'INACTIVO' | 'ALERTA'; lat!: number; lng!: number;
  pasajeros!: number; velocidad!: number;
  constructor(p: { id:number; placa:string; conductor:string; ruta:string; estado:'ACTIVO'|'INACTIVO'|'ALERTA'; lat:number; lng:number; pasajeros:number; velocidad:number; }) {
    Object.assign(this, p);
  }
}

export class AlertaAdmin implements BaseEntity {
  id!: number; tipo!: string; bus!: string; conductor!: string;
  hora!: string; nivel!: 'CRITICO'|'ALTO'|'MEDIO'|'BAJO'; resuelta!: boolean;
  constructor(p: { id:number; tipo:string; bus:string; conductor:string; hora:string; nivel:'CRITICO'|'ALTO'|'MEDIO'|'BAJO'; resuelta:boolean; }) {
    Object.assign(this, p);
  }
}

export class TurnoHistorial implements BaseEntity {
  id!: number; conductorId!: number; conductor!: string; bus!: string;
  ruta!: string; fecha!: string; distancia!: number; pasajeros!: number;
  recaudacion!: number; estado!: string;
  constructor(p: any) { Object.assign(this, p); }
}
