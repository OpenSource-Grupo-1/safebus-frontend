import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { ConductoresApiEndpoint } from './conductores-api-endpoint';
import { Conductor } from '../domain/model/conductor.entity';
import { ConductorAssembler } from './conductor-assembler';

export const MOCK_CONDUCTORES = [
  { id:1, nombre:'MARCOS E.', apellido:'SILVA',  dni:'12345678', codigoEmpleado:'EMP-001', codigoQr:'QR-SF-90210-TX', placa:'ABC-1234', estado:'ACTIVO',   foto:'https://i.pravatar.cc/80?img=11' },
  { id:2, nombre:'JUAN',      apellido:'QUISPE', dni:'23456789', codigoEmpleado:'EMP-002', codigoQr:'QR-SF-90211-TX', placa:'DEF-5678', estado:'ACTIVO',   foto:'https://i.pravatar.cc/80?img=12' },
  { id:3, nombre:'PEDRO',     apellido:'MAMANI', dni:'34567890', codigoEmpleado:'EMP-003', codigoQr:'QR-SF-90212-TX', placa:'GHI-9012', estado:'INACTIVO', foto:'https://i.pravatar.cc/80?img=13' },
  { id:4, nombre:'MIGUEL',    apellido:'FLORES', dni:'45678901', codigoEmpleado:'EMP-004', codigoQr:'QR-SF-90213-TX', placa:'JKL-3456', estado:'ACTIVO',   foto:'https://i.pravatar.cc/80?img=14' },
  { id:5, nombre:'LUIS',      apellido:'CCAMA',  dni:'56789012', codigoEmpleado:'EMP-005', codigoQr:'QR-SF-90214-TX', placa:'MNO-7890', estado:'ACTIVO',   foto:'https://i.pravatar.cc/80?img=15' },
  { id:6, nombre:'CARLOS',    apellido:'HUANCA', dni:'67890123', codigoEmpleado:'EMP-006', codigoQr:'QR-SF-90215-TX', placa:'PQR-1234', estado:'ACTIVO',   foto:'https://i.pravatar.cc/80?img=16' },
  { id:7, nombre:'ROBERTO',   apellido:'APAZA',  dni:'78901234', codigoEmpleado:'EMP-007', codigoQr:'QR-SF-90216-TX', placa:'STU-5678', estado:'ACTIVO',   foto:'https://i.pravatar.cc/80?img=17' },
];

@Injectable({ providedIn: 'root' })
export class ConductorApiEndpoint {
  private http = inject(HttpClient);
  private endpoint = new ConductoresApiEndpoint(this.http);

  getAll(): Observable<Conductor[]>           { return this.endpoint.getAll(); }
  getById(id: number): Observable<Conductor>  { return this.endpoint.getById(id); }
  create(c: Conductor): Observable<Conductor> { return this.endpoint.create(c); }
  update(c: Conductor): Observable<Conductor> { return this.endpoint.update(c, c.id); }

  verifyByCode(codigo: string): Observable<Conductor | null> {
    const mock = MOCK_CONDUCTORES.find(c => c.codigoEmpleado === codigo || c.codigoQr === codigo);
    return of(mock ? new ConductorAssembler().toEntityFromResource(mock) : null);
  }

  getMockList(): Conductor[] {
    return MOCK_CONDUCTORES.map(c => new ConductorAssembler().toEntityFromResource(c));
  }
}
