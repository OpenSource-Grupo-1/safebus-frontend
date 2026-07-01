import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ConductoresApiEndpoint } from './conductores-api-endpoint';
import { Conductor } from '../domain/model/conductor.entity';
import { ConductorAssembler } from './conductor-assembler';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ConductorApiEndpoint {
  private http = inject(HttpClient);
  private endpoint = new ConductoresApiEndpoint(this.http);
  private assembler = new ConductorAssembler();

  getAll(): Observable<Conductor[]>           { return this.endpoint.getAll(); }
  getById(id: number): Observable<Conductor>  { return this.endpoint.getById(id); }
  create(c: Conductor): Observable<Conductor> { return this.endpoint.create(c); }
  update(c: Conductor): Observable<Conductor> { return this.endpoint.update(c, c.id); }

  verifyByCode(codigo: string): Observable<Conductor | null> {
    const url = `${environment.platformProviderApiBaseUrl}/employees/code/${codigo}`;
    return this.http.get<any>(url).pipe(
      map(response => response ? this.assembler.toEntityFromResource(response) : null)
    );
  }

  getMockList(): Conductor[] { return []; }
}
