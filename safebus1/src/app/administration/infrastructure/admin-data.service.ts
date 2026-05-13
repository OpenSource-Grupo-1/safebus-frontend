import { Injectable } from '@angular/core';
import { UnidadBus, AlertaAdmin, TurnoHistorial } from '../domain/model/admin.entity';
import { MOCK_CONDUCTORES } from '../../conductor/infrastructure/conductor-api-endpoint';

@Injectable({ providedIn: 'root' })
export class AdminDataService {
  getUnidades(): UnidadBus[] {
    return [
      new UnidadBus({ id:1, placa:'ABC-1234', conductor:'Marcos E. Silva', ruta:'R-42', estado:'ACTIVO',   lat:-12.0464, lng:-77.0428, pasajeros:32, velocidad:48 }),
      new UnidadBus({ id:2, placa:'DEF-5678', conductor:'Juan Quispe',     ruta:'R-15', estado:'ACTIVO',   lat:-12.0600, lng:-77.0300, pasajeros:18, velocidad:52 }),
      new UnidadBus({ id:3, placa:'GHI-9012', conductor:'Pedro Mamani',    ruta:'R-07', estado:'ALERTA',   lat:-12.0700, lng:-77.0500, pasajeros:45, velocidad:75 }),
      new UnidadBus({ id:4, placa:'JKL-3456', conductor:'Miguel Flores',   ruta:'R-22', estado:'ACTIVO',   lat:-12.0900, lng:-77.0600, pasajeros:10, velocidad:40 }),
      new UnidadBus({ id:5, placa:'MNO-7890', conductor:'Luis Ccama',      ruta:'R-33', estado:'INACTIVO', lat:-12.1000, lng:-77.0200, pasajeros:0,  velocidad:0  }),
      new UnidadBus({ id:6, placa:'PQR-1234', conductor:'Carlos Huanca',   ruta:'R-42', estado:'ACTIVO',   lat:-12.0300, lng:-77.0100, pasajeros:27, velocidad:55 }),
      new UnidadBus({ id:7, placa:'STU-5678', conductor:'Roberto Apaza',   ruta:'R-08', estado:'ACTIVO',   lat:-12.0200, lng:-77.0400, pasajeros:38, velocidad:43 }),
    ];
  }

  getAlertas(): AlertaAdmin[] {
    return [
      new AlertaAdmin({ id:1, tipo:'PÁNICO',    bus:'GHI-9012', conductor:'Pedro Mamani',   hora:'07:05', nivel:'CRITICO', resuelta:false }),
      new AlertaAdmin({ id:2, tipo:'VELOCIDAD', bus:'GHI-9012', conductor:'Pedro Mamani',   hora:'07:02', nivel:'ALTO',    resuelta:false }),
      new AlertaAdmin({ id:3, tipo:'PASAJEROS', bus:'GHI-9012', conductor:'Pedro Mamani',   hora:'07:30', nivel:'MEDIO',   resuelta:false }),
      new AlertaAdmin({ id:4, tipo:'DESVÍO',    bus:'ABC-1234', conductor:'Marcos E. Silva',hora:'06:50', nivel:'BAJO',    resuelta:true  }),
      new AlertaAdmin({ id:5, tipo:'PÁNICO',    bus:'DEF-5678', conductor:'Juan Quispe',    hora:'06:20', nivel:'CRITICO', resuelta:true  }),
    ];
  }

  getConductores() { return MOCK_CONDUCTORES; }

  getHistorial(): TurnoHistorial[] {
    return [
      new TurnoHistorial({ id:1, conductorId:1, conductor:'Marcos E. Silva', bus:'ABC-1234', ruta:'R-42', fecha:'2025-04-25', distancia:32.5, pasajeros:45, recaudacion:890,  estado:'FINALIZADO' }),
      new TurnoHistorial({ id:2, conductorId:2, conductor:'Juan Quispe',     bus:'DEF-5678', ruta:'R-15', fecha:'2025-04-25', distancia:28.0, pasajeros:38, recaudacion:760,  estado:'FINALIZADO' }),
      new TurnoHistorial({ id:3, conductorId:3, conductor:'Pedro Mamani',    bus:'GHI-9012', ruta:'R-07', fecha:'2025-04-26', distancia:15.2, pasajeros:22, recaudacion:440,  estado:'ALERTA'     }),
      new TurnoHistorial({ id:4, conductorId:4, conductor:'Miguel Flores',   bus:'JKL-3456', ruta:'R-22', fecha:'2025-04-26', distancia:40.0, pasajeros:60, recaudacion:1200, estado:'FINALIZADO' }),
      new TurnoHistorial({ id:5, conductorId:1, conductor:'Marcos E. Silva', bus:'ABC-1234', ruta:'R-42', fecha:'2025-04-24', distancia:33.1, pasajeros:50, recaudacion:1000, estado:'FINALIZADO' }),
    ];
  }
}
